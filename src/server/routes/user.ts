import UserHandler from "../../handlers/user";
import {
    verifyAdmin,
    verifyBody,
    verifyParams,
    verifyToken,
} from "../../server/middleware/verify";
import Achievement from "../../server/models/achievement";
import Address from "../../server/models/address";
import Interaction from "../../server/models/feed/interaction";
import Post from "../../server/models/feed/post";
import Institute from "../../server/models/institute";
import User from "../../server/models/user";
import Admin from "../../server/models/user/admin";
import Connection from "../../server/models/user/connection";
import ConnectionRequest from "../../server/models/user/connection-request";
import Education from "../../server/models/user/education";
import Profile from "../../server/models/user/profile";
import IUser from "../../types_/user";
import IConnection from "../../types_/user/connection";
import IConnectionRequest from "../../types_/user/connection-request";
import ISession from "../../types_/user/session";
import { downloadFile } from "../../utils/file";
import { getValue } from "../../utils/object";
import { Request, Response, Router } from "express";
import Multer from "multer";

const app = Router();
const handler = new UserHandler();
const multer = Multer();

app.get("/all-users", verifyToken(), async (_, res) => {
    const { session } = res.locals;

    // Fetch connection requests as plain objects
    const connectionRequests = await ConnectionRequest.find({
        $or: [
            { from: (session.user as IUser)._id },
            { to: (session.user as IUser)._id },
        ],
    }).lean<IConnectionRequest[]>(); // Ensure an array of IConnectionRequest

    // Safely reduce connection requests to user IDs
    const connectionRequestUserIds = connectionRequests.reduce<string[]>(
        (userIds, request) => {
            if (request.from.toString() !== (session.user as IUser)._id.toString()) {
                userIds.push(request.from.toString());
            }
            if (request.to.toString() !== (session.user as IUser)._id.toString()) {
                userIds.push(request.to.toString());
            }
            return userIds;
        },
        []
    );

    // Fetch connections as plain objects
    const connections = await Connection.find({
        users: { $in: [(session.user as IUser)._id] },
    }).lean<IConnection[]>(); // Ensure an array of IConnection

    // Safely reduce connections to user IDs
    const connectionUserIds = connections.reduce<string[]>(
        (userIds, connection) => {
            const otherUser = connection.users.find(
                (user) => user.toString() !== (session.user as IUser)._id.toString()
            );
            if (otherUser) {
                userIds.push(otherUser.toString());
            }
            return userIds;
        },
        []
    );

    // Combine and deduplicate user IDs
    const allUserIds = Array.from(
        new Set([...connectionRequestUserIds, ...connectionUserIds])
    );

    // Fetch all users excluding the current user and already connected users
    const allUsers = await User.find({
        _id: { $nin: [(session.user as IUser)._id, ...allUserIds] },
    }).lean<IUser[]>(); // Fetch all users as plain objects

    return res.status(200).send(handler.success(allUsers));
});



app.get("/details/:id", verifyToken(), verifyParams(["id"]), async (_, res) => {
    const { keys, values } = res.locals;
    const user = await User.findById(getValue(keys, values, "id"))
        .populate([
            {
                path: "profile",
                strictPopulate: false,
                populate: [
                    {
                        path: "education",
                        populate: "institute",
                    },
                    "achievements",
                    "skills",
                    "address",
                    "workExperience",
                ],
            },
            { path: "admin", strictPopulate: false },
            { path: "faculty", strictPopulate: false },
        ])
        .select("-password")
        .exec();
    if (!user) {
        return res.status(404).send(handler.error(handler.STATUS_404));
    }
    return res.status(200).send(handler.success(user));
});

app.put(
    "/promote/:user/:role",
    verifyToken(),
    verifyAdmin(),
    verifyParams(["user", "role"]),
    async (_, res) => {
        const { keys, values, session } = res.locals;
        const user = await User.findById(getValue(keys, values, "user"));
        if (!user) {
            return res.status(404).send(handler.error(handler.STATUS_404));
        }
        const role = (getValue(keys, values, "role") as string).split(":");
        if (role.length !== 2 && role[0] !== "institute") {
            return res.status(404).send(handler.error("Invalid user role."));
        }
        const institute = await Institute.findById(role[1]);
        if (!institute) {
            return res.status(404).send(handler.error("Invalid institute id."));
        }
        const admin = await Admin.create({
            role: role[0],
            createdBy: (session.user as IUser)._id,
            institute: institute._id,
        });
        if (!admin) {
            return res.status(404).send(handler.error(handler.STATUS_404));
        }
        user.set("admin", admin._id);
        const updatedUser = await user.save();
        if (!updatedUser) {
            return res.status(404).send(handler.error(handler.STATUS_404));
        }
        institute.set("admin", user._id);
        const updatedInstitute = await institute.save();
        if (!updatedInstitute) {
            return res.status(404).send(handler.error(handler.STATUS_404));
        }
        updatedUser.admin = admin;
        return res.status(200).send(handler.success(updatedUser));
    }
);

app.get("/get-all", verifyToken(), async (_, res) => {
    const { session } = res.locals;
    const users = await User.find({
        _id: { $ne: (session.user as IUser)._id },
    });
    if (!users) {
        return res.status(404).json(handler.error(handler.STATUS_404));
    }
    return res.status(200).json(handler.success(users));
});

const registerFields = ["name.first", "name.last", "dob", "phone"];
app.put(
    "/update",
    verifyToken(),
    verifyBody(registerFields),
    async (_: Request, res: Response) => {
        const { keys, values, session } = res.locals;
        const user = await User.findById((session.user as IUser)._id);
        if (!user) {
            return res.status(404).send(handler.error(handler.STATUS_404));
        }
        for (const key of keys as string[]) {
            user.set(key, getValue(keys, values, key));
        }
        const updatedUser = await user.save();
        if (!updatedUser) {
            return res.status(404).send(handler.error(handler.STATUS_404));
        }
        return res.status(200).send(handler.success(updatedUser));
    }
);

app.get("/", verifyToken(), async (_, res) => {
    const { session } = res.locals;
    const user = await User.findById(((session as ISession).user as IUser)._id);
    if (!user) {
        return res.status(404).send(handler.error(handler.STATUS_404));
    }
    return res.status(200).send(handler.success(user));
});

app.put(
    "/updateProfilePhoto",
    verifyToken(),
    multer.single("profile"),
    async (req, res) => {
        const { session } = res.locals;
        const user = await User.findById((session.user as IUser)._id);
        if (!user) {
            return res.status(404).send(handler.error(handler.STATUS_404));
        }
        const file = req.file as Express.Multer.File;
        if (!file) {
            return res.status(200).send(handler.success("Nothing to update!"));
        }
        if (!["image/png", "image/jpeg"].includes(file.mimetype)) {
            return res
                .status(404)
                .send(handler.STATUS_404 + " Invalid File type!");
        }
        const profilePhoto = await downloadFile(
            "profilePhoto." + file.originalname.split(".").pop(),
            user._id.toString(),
            file.buffer
        );
        if (!profilePhoto) {
            return res.status(404).send(handler.STATUS_404);
        }
        user.set("profilePhoto", profilePhoto);
        const updatedUser = await user.save();
        if (!updatedUser) {
            return res.status(404).send(handler.error(handler.STATUS_404));
        }
        return res.status(200).send(handler.success(updatedUser));
    }
);

app.delete(
    "/:id",
    verifyToken(),
    verifyAdmin(),
    verifyParams(["id"]),
    async (_, res) => {
        const { keys, values } = res.locals;
        const userId = getValue(keys, values, "id");
        await Interaction.deleteMany({ user: userId });
        await Post.deleteMany({ user: userId });
        const user = await User.findById(userId);
        if (user && user.profile) {
            const profileId = user.profile;
            const deletedProfile = await Profile.findByIdAndDelete(profileId);
            if (!deletedProfile) {
                return res.status(404).send(handler.error(handler.STATUS_404));
            }
            await Education.deleteMany({
                _id: { $in: deletedProfile.education },
            });
            await Achievement.deleteMany({
                _id: { $in: deletedProfile.achievements },
            });
            await Address.findByIdAndDelete(deletedProfile.address);
        }
        await ConnectionRequest.deleteMany({
            $or: [{ from: userId }, { to: userId }],
        });
        await Connection.deleteMany({
            users: userId,
        });
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).send(handler.error(handler.STATUS_404));
        }
        return res.status(200).send(handler.success(deletedUser));
    }
);

export default app;

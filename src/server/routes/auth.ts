import UserHandler from "../../handlers/user";
import { JWT_SECRET, JWT_SESSION_TIMEOUT } from "../../server/config";
import {
    verifyBody,
    verifyToken,
    verifyParams,
} from "../../server/middleware/verify";
import User from "../../server/models/user";
import Admin from "../../server/models/user/admin";
import Session from "../../server/models/user/session";
import IUser, { ProfileRoles } from "../../types_/user";
import { downloadFile } from "../../utils/file";
import Hash from "../../utils/hash";
import { getValue } from "../../utils/object";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { MongooseError } from "mongoose";
import Multer from "multer";

const app = Router();
const multer = Multer();

const handler = new UserHandler();

const registerFields = [
    "name.first",
    "name.last",
    "dob",
    "email",
    "phone",
    "password",
    "role",
];

app.post(
    "/register",
    multer.single("profilePhoto"),
    verifyBody(registerFields, handler),
    async (req, res) => {
        const { keys, values } = res.locals;

        try {
            // Create a new user instance
            let user = new User({
                name: {
                    first: getValue(keys, values, "name.first"),
                    last: getValue(keys, values, "name.last"),
                },
                dob: getValue(keys, values, "dob"),
                email: getValue(keys, values, "email"),
                phone: getValue(keys, values, "phone"),
                password: getValue(keys, values, "password") as string,
                role:
                    getValue(keys, values, "role") === "institute"
                        ? ProfileRoles.admin
                        : getValue(keys, values, "role"),
                ...(keys.includes("bio") &&
                    getValue(keys, values, "bio").length && {
                        bio: getValue(keys, values, "bio"),
                    }),
            } as IUser);

            // Validate the user object
            await user.validate();

            // Handle profile photo upload if provided
            if (req.file && ["image/png", "image/jpeg"].includes(req.file.mimetype)) {
                const file = req.file;
                const profilePhoto = await downloadFile(
                    "profilePhoto." + file.originalname.split(".").pop(),
                    user._id.toString(),
                    file.buffer
                );
                if (profilePhoto) {
                    user.profilePhoto = profilePhoto;
                }
            }

            // Create an admin record if the role is "institute"
            let admin = null;
            if (getValue(keys, values, "role") === "institute") {
                admin = await Admin.create({
                    role: getValue(keys, values, "role"),
                    createdBy: "656de3f2bdcaade9d49d0f4b", // Example user ID
                });

                if (!admin) {
                    return res.status(404).send(handler.error("Admin record creation failed."));
                }

                // Associate the admin ID with the user
                user.set("admin", admin._id);
            }

            // Save the user
            user = await user.save();

            // Generate a JWT token
            const token = jwt.sign(
                {
                    user: user._id.toString(),
                    createdAt: Date.now(),
                },
                JWT_SECRET,
                { expiresIn: JWT_SESSION_TIMEOUT }
            );

            // Create a session
            const session = await Session.create({ user: user._id, token });

            // Re-fetch the user using `lean` for the final session payload
            const populatedUser = await User.findById(user._id).populate("admin").lean<IUser>();
            if (!populatedUser) {
                throw new Error("User not found after saving.");
            }

            session.user = populatedUser;

            return res.status(200).send(handler.success(session));
        } catch (err: MongooseError | any) {
            console.error("Registration Error:", err.message || err);
            return res.status(500).send(handler.error("An unexpected error occurred during registration."));
        }
    }
);

app.post(
    "/login",
    verifyBody(["email", "password"], handler),
    async (_, res) => {
        const { keys, values } = res.locals;

        try {
            const user = await User.findOne({ email: getValue(keys, values, "email") })
                .populate("admin")
                .lean<IUser>();

            if (!user) {
                return res.status(404).send(handler.error("User not found."));
            }

            if (
                !Hash.simpleCompare(
                    getValue(keys, values, "password") as string,
                    user.password
                )
            ) {
                return res.status(401).send(handler.error("Incorrect password, try again."));
            }

            const token = jwt.sign(
                {
                    user: user._id.toString(),
                    createdAt: Date.now(),
                },
                JWT_SECRET,
                { expiresIn: JWT_SESSION_TIMEOUT }
            );

            const session = await Session.create({ user: user._id, token });
            session.user = user as IUser;

            return res.status(200).send(handler.success(session));
        } catch (err) {
            console.error("Login Error:", err.message || err);
            return res.status(500).send(handler.error("An unexpected error occurred during login."));
        }
    }
);

app.post("/verify", verifyToken(handler), (_, res) => {
    try {
        return res.status(200).send(handler.success(res.locals.session));
    } catch (err) {
        console.error("Token Verification Error:", err.message || err);
        return res.status(500).send(handler.error("An unexpected error occurred during token verification."));
    }
});

app.get("/get-user/:email", verifyParams(["email"]), async (_, res) => {
    const { keys, values } = res.locals;

    try {
        const user = await User.findOne({ email: getValue(keys, values, "email") });

        if (!user) {
            return res.status(404).send(handler.error("User not found."));
        }

        return res.status(200).send(handler.success(user));
    } catch (err) {
        console.error("Get User Error:", err.message || err);
        return res.status(500).send(handler.error("An unexpected error occurred while fetching the user."));
    }
});

export default app;

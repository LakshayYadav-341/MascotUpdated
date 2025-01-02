import { verifyBody, verifyParams, verifyToken } from "../../server/middleware/verify";
import IUser from "../../types_/user";
import { getValue } from "../../utils/object";
import { Router } from "express";
import Chat from "../../server/models/chat";
import ChatHandler from "../../handlers/chat";
import User from "../../server/models/user";

const app = Router();

const handler = new ChatHandler();

const required = ["user"];
app.post("/", verifyToken(), verifyBody(required), async (_, res) => {
    try {
        const { keys, values, session } = res.locals;
        const user = (session.user as IUser)._id.toString();
        const otherUser = getValue(keys, values, "user");

        const newChat = await Chat.create({ members: [user, otherUser] });
        if (!newChat) {
            return res.status(404).send(handler.error(handler.STATUS_404));
        }

        const tempUser = await User.findById(otherUser);
        if (!tempUser) {
            return res.status(404).send("User not Found!!");
        }

        const resData = {
            _id: newChat._id,
            members: [session.user, tempUser],
        };

        return res.status(200).send(handler.success(resData));
    } catch (error) {
        console.error("Error in POST /:", error);
        return res.status(500).send(handler.error("Internal Server Error"));
    }
});

app.get("/find", verifyToken(), async (_, res) => {
    try {
        const { session } = res.locals;
        const userId = (session.user as IUser)._id;

        const chat = await Chat.find({ members: { $in: userId } })
            .populate([{ path: "members" }])
            .exec() || [];

        if (!chat) {
            return res.status(404).send(handler.error(handler.STATUS_404));
        }

        return res.status(200).send(handler.success(chat));
    } catch (error) {
        console.error("Error in GET /find:", error);
        return res.status(500).send(handler.error("Internal Server Error"));
    }
});

app.get("/find/:userId", verifyToken(), verifyParams(["userId"]), async (_, res) => {
    try {
        const { keys, values, session } = res.locals;
        const userId = (session.user as IUser)._id;
        const otherUserId = getValue(keys, values, "userId");

        const chat = await Chat.findOne({
            members: { $all: [userId, otherUserId] },
        })
            .populate([{ path: "members" }])
            .exec() || {};

        if (!chat) {
            return res.status(404).send(handler.error(handler.STATUS_404));
        }

        return res.status(200).send(handler.success(chat));
    } catch (error) {
        console.error("Error in GET /find/:userId:", error);
        return res.status(500).send(handler.error("Internal Server Error"));
    }
});

export default app;

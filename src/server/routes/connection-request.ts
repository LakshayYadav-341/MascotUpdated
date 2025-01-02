import ConnectionRequestHandler from "../../handlers/user/connection-request";
import { verifyBody, verifyParams, verifyToken } from "../../server/middleware/verify";
import Institute from "../../server/models/institute";
import Connection from "../../server/models/user/connection";
import ConnectionRequest from "../../server/models/user/connection-request";
import IUser from "../../types_/user";
import { ConnectionTypes } from "../../types_/user/connection-request";
import { downloadFile } from "../../utils/file";
import Hash from "../../utils/hash";
import { getValue } from "../../utils/object";
import { Router } from "express";
import Multer from "multer";

const app = Router();
const handler = new ConnectionRequestHandler();
const multer = Multer({
    fileFilter: (_, file, cb) => {
        if (file.originalname.split(".").pop() !== "pdf") {
            return cb(new Error("The input file is not a pdf document"));
        }
        return cb(null, true);
    }
});

const required = ["to", "type"];

app.post("/create", verifyToken(), multer.single("document"), verifyBody(required), async (req, res) => {
    try {
        const { keys, values, session } = res.locals;
        const userType = getValue(keys, values, "type");

        if (!Object.values(ConnectionTypes).includes(userType)) {
            return res.status(422).send(handler.error(handler.fieldInvalid("type")));
        }

        const user = (session.user as IUser)._id.toString();
        const request = new ConnectionRequest({
            from: user,
            to: getValue(keys, values, "to"),
            type: userType
        });

        if (userType === ConnectionTypes.alumniRequest) {
            const instituteId = getValue(keys, values, "institute");
            const institute = await Institute.findById(instituteId);

            if (!institute) {
                return res.status(422).send(handler.error("Institute not found! Please add the corresponding institute."));
            }

            request.set("institute", institute._id);
            const file = req.file;

            if (!file) {
                return res.status(422).send(handler.error(handler.fieldInvalid("document", "Alumni Request requires a document to upload type pdf.")));
            }

            const originalName = file.originalname.split(".");
            const mimeType = originalName.pop();
            const fileName = Hash.create(user + "--" + originalName.join(".")).replace(/\//g, "--");
            const url = await downloadFile(`${fileName}.${mimeType}`, user, file.buffer) as string;
            request.set("document", url);
        }

        const connectionRequest = await request.save();
        if (!connectionRequest) {
            return res.status(404).send(handler.error(handler.STATUS_404));
        }

        return res.status(200).send(handler.success(connectionRequest));

    } catch (error) {
        console.error("Error creating connection request:", error);
        return res.status(500).send(handler.error("Internal server error. Could not create connection request."));
    }
});

app.get("/:type", verifyToken(), verifyParams(["type"]), async (_, res) => {
    try {
        const { keys, values, session } = res.locals;
        const connectionRequests = await ConnectionRequest.find({
            from: (session.user as IUser)._id,
            type: getValue(keys, values, "type")
        }) || [];

        return res.status(200).send(handler.success(connectionRequests));

    } catch (error) {
        console.error("Error fetching connection requests:", error);
        return res.status(500).send(handler.error("Internal server error. Could not fetch connection requests."));
    }
});

app.delete("/:request/ignore", verifyToken(), verifyParams(["request"]), async (_, res) => {
    try {
        const { keys, values } = res.locals;
        const connectionRequest = await ConnectionRequest.findByIdAndDelete(getValue(keys, values, "request"));

        if (!connectionRequest) {
            return res.status(404).send(handler.error(handler.STATUS_404));
        }

        return res.status(200).send(handler.success(connectionRequest));

    } catch (error) {
        console.error("Error ignoring connection request:", error);
        return res.status(500).send(handler.error("Internal server error. Could not ignore the connection request."));
    }
});

app.put("/:request/mutual/accept", verifyToken(), verifyParams(["request"]), async (_, res) => {
    try {
        const { keys, values, session } = res.locals;
        const connectionRequest = await ConnectionRequest.findByIdAndDelete(getValue(keys, values, "request")).populate([
            { path: "from", select: "-password" },
            { path: "to", select: "-password" }
        ]).exec();

        if (!connectionRequest) {
            return res.status(404).send(handler.error(handler.STATUS_404));
        }

        const user = session.user as IUser;
        if (user._id.toString() !== (connectionRequest.to as IUser)._id.toString()) {
            return res.status(403).send(handler.error("Unauthorized! Invalid user."));
        }

        const connection = await Connection.create({
            users: [(connectionRequest.from as IUser)._id, (connectionRequest.to as IUser)._id]
        });

        if (!connection) {
            return res.status(404).send(handler.error(handler.STATUS_404));
        }

        return res.status(200).send(handler.success(connection));

    } catch (error) {
        console.error("Error accepting mutual connection request:", error);
        return res.status(500).send(handler.error("Internal server error. Could not accept connection request."));
    }
});

app.get("/", verifyToken(), async (_, res) => {
    try {
        const { session } = res.locals;
        const connectionRequests = await ConnectionRequest.find({ to: (session.user as IUser)._id }).populate({
            path: "from",
            select: "-password"
        }).exec();

        if (!connectionRequests) {
            return res.status(404).send(handler.error(handler.STATUS_404));
        }

        return res.status(200).send(handler.success(connectionRequests));

    } catch (error) {
        console.error("Error fetching connection requests:", error);
        return res.status(500).send(handler.error("Internal server error. Could not fetch connection requests."));
    }
});

export default app;

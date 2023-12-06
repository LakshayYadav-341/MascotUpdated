import ConnectionRequestHandler from "@handlers/user/connection-request";
import { verifyBody, verifyParams, verifyToken } from "@server/middleware/verify";
import Connection from "@server/models/user/connection";
import ConnectionRequest from "@server/models/user/connection-request";
import IUser from "@types_/user";
import { ConnectionTypes } from "@types_/user/connection-request";
import { downloadFile } from "@utils/file";
import Hash from "@utils/hash";
import { getValue } from "@utils/object";
import { Router } from "express";
import Multer from "multer";

const app = Router();
const handler = new ConnectionRequestHandler();
const multer = Multer({
    fileFilter: (_, file, cb) => {
        if (file.originalname.split(".").pop() !== "pdf") {
            return cb(new Error("The input file is not a pdf document"))
        }
        return cb(null, true)
    }
})

const required = ["to", "type"];
app.post("/create", verifyToken(), multer.single("document"), verifyBody(required), async (req, res) => {
    const { keys, values, session } = res.locals;
    if (!Object.values(ConnectionTypes).includes(getValue(keys, values, "type"))) {
        return res.status(422).send(handler.error(handler.fieldInvalid("type")))
    }
    let url = ""
    const user = (session.user as IUser)._id.toString()
    if (getValue(keys, values, "type") === ConnectionTypes.alumniRequest) {
        const file = req.file
        if(!file) {
            return res.status(422).send(handler.error(handler.fieldInvalid("document", "Alumni Request requires a document to upload type pdf.")))
        }
        const originalName = file!.originalname.split(".")
        const mimeType = originalName.pop()
        const fileName = Hash.create(user + "--" + originalName.join(".")).replace(/\//g, "--")
        url = await downloadFile(`${fileName}.${mimeType}`, user, file!.buffer) as string
    }
    const connectionRequest = await ConnectionRequest.create({
        from: user,
        to: getValue(keys, values, "to"),
        type: getValue(keys, values, "type"),
        ...(getValue(keys, values, "type") === ConnectionTypes.alumniRequest && (keys.includes("document") && url && url.length) && {
            document: url
        })
    });
    if (!connectionRequest) {
        return res.status(404).send(handler.error(handler.STATUS_404))
    }
    return res.status(200).send(handler.success(connectionRequest))
});

// app.get("/", async (_, res) => {
//     const connectionRequests = await ConnectionRequest.find()
//     return res.status(200).send(handler.success(connectionRequests))
// })


// app.get("/:id", async (req, res) => {
//     const connectionRequestId = req.params.id;
//     const connectionRequest = await ConnectionRequest.findById(connectionRequestId)
//     if (!connectionRequest) {
//         return res.status(404).send(handler.error(handler.STATUS_404))
//     }
//     return res.status(200).send(handler.success(connectionRequest))
// })


app.delete("/:request/ignore", verifyToken(),verifyParams(["request"]), async (_, res) => {
    const { keys, values } = res.locals
    const connectionRequest = await ConnectionRequest.findByIdAndDelete(getValue(keys, values, "request"))
    if (!connectionRequest) {
        return res.status(404).send(handler.error(handler.STATUS_404))
    }
    return res.status(200).send(handler.success(connectionRequest))
})

app.put("/:request/mutual/accept", verifyToken(), verifyParams(["request"]), async (_, res) => {
    const { keys, values, session } = res.locals
    const connectionRequest = await ConnectionRequest.findByIdAndDelete(getValue(keys, values, "request")).populate([
        {
            path: "from",
            select: "-password"
        },
        {
            path: "to",
            select: "-password"
        }
    ]).exec()
    if (!connectionRequest) {
        return res.status(404).send(handler.error(handler.STATUS_404))
    }
    const user = session.user as IUser
    console.log(user._id)
    console.log(connectionRequest.to)
    if (user._id.toString() !== (connectionRequest.to as IUser)._id.toString()) {
        return res.status(403).send(handler.error("Unauthorized! Invalid user."))
    }
    const connection = await Connection.create({
        users: [(connectionRequest.from as IUser)._id, (connectionRequest.to as IUser)._id]
    })
    if (!connection) {
        return res.status(404).send(handler.error(handler.STATUS_404))
    }
    return res.status(200).send(handler.success(connection))
})

app.get("/from", verifyToken(), async (_, res) => {
    const { session } = res.locals
    const connectionRequests = await ConnectionRequest.find({ to: (session.user as IUser)._id}).populate({
        path: "from",
        select: "-password"
    }).exec()
    if (!connectionRequests) {
        return res.status(404).send(handler.error(handler.STATUS_404))
    }
    return res.status(200).send(handler.success(connectionRequests))
})

export default app;
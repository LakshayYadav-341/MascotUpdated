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

/**
 * @swagger
 * /connection-request/create:
 *   post:
 *     summary: Create a connection request
 *     description: Endpoint to create a new connection request
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               to:
 *                 type: string
 *               institute:
 *                 type: string
 *               document:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Connection request created successfully
 *       '401':
 *         description: Unauthorized access
 *       '404':
 *         description: Failed to create connection request
 *       '422':
 *         description: Unprocessable Entity
 */

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

// DELETE request to ignore a connection request
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

/**
 * @swagger
 * /api/connection-request/{request}/mutual/accept:
 *   put:
 *     summary: Accept mutual connection request
 *     description: Accepts a mutual connection request specified by the request ID.
 *     parameters:
 *       - in: path
 *         name: request
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the connection request to accept.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A successful response with the accepted connection.
 *       '403':
 *         description: Forbidden. User does not have permission to accept this connection request.
 *       '404':
 *         description: Not Found. Connection request not found or unable to create a connection.
 *       '401':
 *         description: Unauthorized. Token is missing or invalid.
 *       '500':
 *         description: Internal Server Error.
 *     examples:
 *       example1:
 *         summary: Example of authorization header
 *         value:
 *           headers:
 *             Authorization: Bearer <JWT-Token>
 * definitions:
 *   Connection:
 *     type: object
 *     properties:
 *       // Define properties of the Connection object here
 */

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

import ConnectionHandler from "../../handlers/user/connection";
import { verifyToken, verifyParams } from "../../server/middleware/verify";
import Connection from "../../server/models/user/connection";
import { Router } from "express";
import { getValue } from "../../utils/object";
import IUser from "../../types_/user";

const app = Router();
const handler = new ConnectionHandler();

// Error handling middleware
const handleError = (res, error, message) => {
    console.error(message, error);
    return res.status(500).send(handler.error(message));
};

// POST request to create a connection
app.post("/create", verifyToken(), async (req, res) => {
    try {
        const { userIds } = req.body;
        if (!userIds || userIds.length < 2) {
            return res.status(400).send(handler.error("User IDs are required and must contain at least two users."));
        }

        const connection = await Connection.create({
            users: userIds,
        });

        if (!connection) {
            return res.status(404).send(handler.error(handler.STATUS_404));
        }

        return res.status(200).send(handler.success(connection));
    } catch (error) {
        return handleError(res, error, "Internal server error. Could not create connection.");
    }
});

// GET request to retrieve all connections
app.get("/", async (_, res) => {
    try {
        const connections = await Connection.find();
        if (!connections) {
            return res.status(404).send(handler.error("No connections found."));
        }
        return res.status(200).send(handler.success(connections));
    } catch (error) {
        return handleError(res, error, "Internal server error. Could not fetch connections.");
    }
});

// GET request to retrieve a specific connection by its ID
app.get("/:id", async (req, res) => {
    try {
        const connectionId = req.params.id;
        if (!connectionId) {
            return res.status(400).send(handler.error("Connection ID is required."));
        }

        const connection = await Connection.findById(connectionId);
        if (!connection) {
            return res.status(404).send(handler.error("Connection not found."));
        }

        return res.status(200).send(handler.success(connection));
    } catch (error) {
        return handleError(res, error, "Internal server error. Could not retrieve connection.");
    }
});

// DELETE request to delete a connection by its ID
app.delete("/:id", verifyToken(), async (req, res) => {
    try {
        const connectionId = req.params.id;
        if (!connectionId) {
            return res.status(400).send(handler.error("Connection ID is required."));
        }

        const connection = await Connection.findByIdAndDelete(connectionId);
        if (!connection) {
            return res.status(404).send(handler.error("Connection not found."));
        }

        return res.status(200).send(handler.success(connection));
    } catch (error) {
        return handleError(res, error, "Internal server error. Could not delete connection.");
    }
});

// DELETE request to remove a connection between two users
app.delete("/delete/:id", verifyToken(), verifyParams(["id"]), async (_req, res) => {
    try {
        const { session, keys, values } = res.locals;
        const loggedInUserId = (session?.user as IUser)._id;
        const targetUserId = getValue(keys, values, "id");

        if (!loggedInUserId || !targetUserId) {
            return res.status(400).send(handler.error("Both users' IDs are required."));
        }

        const connection = await Connection.deleteOne({
            users: { $all: [loggedInUserId, targetUserId] },
        });

        if (!connection || connection.deletedCount === 0) {
            return res.status(404).send(handler.error("Connection not found or already deleted."));
        }

        return res.status(200).send(handler.success(connection));
    } catch (error) {
        return handleError(res, error, "Internal server error. Could not delete the connection.");
    }
});

export default app;

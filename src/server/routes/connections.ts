import ConnectionHandler from "../../handlers/user/connection";
import { verifyParams, verifyToken } from "../../server/middleware/verify";
import Connection from "../../server/models/user/connection";
import { getValue } from "../../utils/object";
import { Router } from "express";
import mongoose from "mongoose";

const app = Router();
const handler = new ConnectionHandler();

// GET request to retrieve connections for a specific user
app.get("/:user", verifyToken(), verifyParams(["user"]), async (_req, res) => {
    try {
        // Extract the parameters from the request
        const { keys, values } = res.locals;
        const userId = getValue(keys, values, "user");

        if (!userId) {
            // If no user ID is provided, return a bad request error
            return res.status(400).send(handler.error("User ID is required."));
        }

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).send(handler.error("Invalid User ID format."));
        }

        // Query the connections for the given user and populate the 'users' field
        const connections = await Connection.find({ users: userId })
            .populate({
                path: 'users',
                match: { _id: { $ne: userId } },  // Exclude the user themselves
                select: "-password"  // Exclude password field
            })
            .exec();

        // If no connections are found, return a 404 with a relevant message
        if (!connections) {
            return res.status(404).send(handler.error("Something Went Wrong! Connection Data not found."));
        }

        if (connections.length === 0) {
            return res.status(200).send(handler.success("No connections found for this user."));
        }

        // Return the connections if found
        return res.status(200).send(handler.success(connections));
    } catch (error) {
        // Log the error and return a 500 response with a general error message
        console.error("Error fetching connections:", error);
        return res.status(500).send(handler.error("Internal server error. Could not fetch connections."));
    }
});

export default app;

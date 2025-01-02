import InteractionHandler from "../../handlers/feed/interaction";
import { verifyBody, verifyParams, verifyToken } from "../../server/middleware/verify";
import Interaction from "../../server/models/feed/interaction";
import { getValue } from "../../utils/object";
import { Router } from "express";

const app = Router();
const handler = new InteractionHandler();

const required = ["post", "user", "type"];

// Create Interaction
app.post("/create", verifyToken(), verifyBody(required), async (_req, res) => {
    try {
        const { keys, values } = res.locals;
        const interaction = await Interaction.create({
            post: getValue(keys, values, "post"),
            user: getValue(keys, values, "user"),
            type: getValue(keys, values, "type"),
            comment: getValue(keys, values, "comment"),
        });

        if (!interaction) {
            return res.status(404).json(handler.error("Failed to create interaction."));
        }

        return res.status(200).json(handler.success(interaction));
    } catch (error) {
        console.error("Error creating interaction:", error);
        return res.status(500).json(handler.error("An unexpected error occurred."));
    }
});

// Retrieve All Interactions
app.get("/", async (_, res) => {
    try {
        const interactions = await Interaction.find();

        if (!interactions) {
            return res.status(404).json(handler.error("No interactions found."));
        }

        return res.status(200).json(handler.success(interactions));
    } catch (error) {
        console.error("Error retrieving interactions:", error);
        return res.status(500).json(handler.error("An unexpected error occurred."));
    }
});

// Retrieve Interaction by ID
app.get("/:id", async (req, res) => {
    try {
        const interactionId = req.params.id;
        const interaction = await Interaction.findById(interactionId);

        if (!interaction) {
            return res.status(404).json(handler.error(`Interaction with ID ${interactionId} not found.`));
        }

        return res.status(200).json(handler.success(interaction));
    } catch (error) {
        console.error("Error retrieving interaction by ID:", error);
        return res.status(500).json(handler.error("An unexpected error occurred."));
    }
});

// Update Interaction by ID
app.put("/:id", verifyToken(), verifyBody(required), async (req, res) => {
    try {
        const interactionId = req.params.id;
        const { keys, values } = res.locals;

        const interaction = await Interaction.findByIdAndUpdate(
            interactionId,
            {
                post: getValue(keys, values, "post"),
                user: getValue(keys, values, "user"),
                type: getValue(keys, values, "type"),
                comment: getValue(keys, values, "comment"),
            },
            { new: true }
        );

        if (!interaction) {
            return res.status(404).json(handler.error(`Interaction with ID ${interactionId} not found.`));
        }

        return res.status(200).json(handler.success(interaction));
    } catch (error) {
        console.error("Error updating interaction:", error);
        return res.status(500).json(handler.error("An unexpected error occurred."));
    }
});

// Delete Interaction by ID
app.delete("/:id", verifyToken(), verifyParams(["id"]), async (req, res) => {
    try {
        const interactionId = req.params.id;
        const interaction = await Interaction.findByIdAndDelete(interactionId);

        if (!interaction) {
            return res.status(404).json(handler.error(`Interaction with ID ${interactionId} not found.`));
        }

        return res.status(200).json(handler.success(interaction));
    } catch (error) {
        console.error("Error deleting interaction:", error);
        return res.status(500).json(handler.error("An unexpected error occurred."));
    }
});

export default app;

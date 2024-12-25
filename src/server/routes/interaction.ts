import InteractionHandler from "../../handlers/feed/interaction";
import { verifyBody, verifyParams, verifyToken } from "../../server/middleware/verify";
import Interaction from "../../server/models/feed/interaction";
import { getValue } from "../../utils/object";
import { Router } from "express";

const app = Router();
const handler = new InteractionHandler();

const required = ["post", "user", "type"];


// Create Interaction

/**
 * @swagger
 * /api/interactions/create:
 *   post:
 *     summary: Create a new interaction
 *     description: Create a new interaction in the database.
 *     security:
 *       - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               post:
 *                 type: string
 *                 description: ID of the post for the interaction.
 *               user:
 *                 type: string
 *                 description: ID of the user interacting.
 *               type:
 *                 type: string
 *                 description: Type of interaction (e.g., like, comment).
 *               comment:
 *                 type: string
 *                 description: Optional comment for the interaction.
 *             required:
 *               - post
 *               - user
 *               - type
 *     responses:
 *       '200':
 *         description: Interaction created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Interaction'
 *       '404':
 *         description: Interaction not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Error'
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
 *   Interaction:
 *     type: object
 *     properties:
 *       // Define properties of the Interaction object here
 *   Error:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 */

app.post("/create", verifyToken(), verifyBody(required), async (_, res) => {
    const { keys, values } = res.locals;
    const interaction = await Interaction.create({
        post: getValue(keys, values, "post"),
        user: getValue(keys, values, "user"),
        type: getValue(keys, values, "type"),
        comment: getValue(keys, values, "comment"),
    });
    if (!interaction) {
        return res.status(404).send(handler.error(handler.STATUS_404));
    }
    return res.status(200).send(handler.success(interaction));

});

// Retrieve All Interactions
app.get("/", async (_, res) => {
    const interactions = await Interaction.find();
    return res.status(200).send(handler.success(interactions));
});


// Retrieve Interaction by ID
app.get("/:id", async (req, res) => {
    const interactionId = req.params.id;
    const interaction = await Interaction.findById(interactionId);
    if (!interaction) {
        return res.status(404).send(handler.error(handler.STATUS_404));
    }
    return res.status(200).send(handler.success(interaction));
});

// Update Interaction by ID

/**
 * @swagger
 * /api/interactions/{id}:
 *   put:
 *     summary: Update an interaction by ID
 *     description: Update an interaction in the database by its ID.
 *     security:
 *       - jwt: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the interaction to update.
 *         schema:
 *           type: string
 *       - in: body
 *         name: interaction
 *         description: Interaction object to update.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             post:
 *               type: string
 *             user:
 *               type: string
 *             type:
 *               type: string
 *             comment:
 *               type: string
 *     responses:
 *       '200':
 *         description: Interaction updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Interaction'
 *       '404':
 *         description: Interaction not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Error'
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
 *   Interaction:
 *     type: object
 *     properties:
 *       // Define properties of the Interaction object here
 *   Error:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 */

app.put("/:id", verifyToken(), verifyBody(required), async (req, res) => {
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
        return res.status(404).send(handler.error(handler.STATUS_404));
    }
    return res.status(200).send(handler.success(interaction));
});

// Delete Interaction by ID
/**
 * @swagger
 * /api/interactions/{id}:
 *   delete:
 *     summary: Delete an interaction by ID
 *     description: Delete an interaction from the database by its ID.
 *     security:
 *       - jwt: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the interaction to delete.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Interaction deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Interaction'
 *       '404':
 *         description: Interaction not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Error'
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
 *   Interaction:
 *     type: object
 *     properties:
 *       // Define properties of the Interaction object here
 *   Error:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 */

app.delete("/:id", verifyToken(), verifyParams(["id"]), async (req, res) => {
    const interactionId = req.params.id;
    const interaction = await Interaction.findByIdAndDelete(interactionId);
    if (!interaction) {
        return res.status(404).send(handler.error(handler.STATUS_404));
    }
    return res.status(200).send(handler.success(interaction));
});

export default app;

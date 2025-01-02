import AchievementHandler from "../../handlers/achievement";
import { verifyParams, verifyToken } from "../../server/middleware/verify";
import Achievement from "../../server/models/achievement";
import { getValue } from "../../utils/object";
import { Router } from "express";

const app = Router();
const handler = new AchievementHandler();

/**
 * @swagger
 * /api/achievements:
 *   get:
 *     summary: Retrieve all achievements
 *     description: Retrieve all achievements from the database.
 *     security:
 *       - jwt: []
 *     responses:
 *       '200':
 *         description: A successful response with an array of achievements.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Achievement'
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
 *   Achievement:
 *     type: object
 *     properties:
 *       // Define properties of the Achievement object here
 */

app.get("/", verifyToken(), async (_, res) => {
  try {
    const achievements = await Achievement.find() || [];
    return res.status(200).json(handler.success(achievements));
  } catch (error) {
    console.error("Error retrieving achievements:", error);
    return res.status(500).json(handler.error("An unexpected error occurred while retrieving achievements."));
  }
});

/**
 * @swagger
 * /api/achievements/{id}:
 *   get:
 *     summary: Retrieve an achievement by ID
 *     description: Retrieve an achievement from the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the achievement to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - jwt: []
 *     responses:
 *       '200':
 *         description: A successful response with the achievement object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Achievement'
 *       '404':
 *         description: Achievement not found.
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
 *   Achievement:
 *     type: object
 *     properties:
 *       // Define properties of the Achievement object here
 */
app.get("/:id", verifyToken(), verifyParams(["id"]), async (req, res) => {
  try {
    const { keys, values } = res.locals;
    const id = getValue(keys, values, "id");

    // Ensure ID is valid
    if (!id) {
      return res.status(400).json(handler.error("Invalid ID parameter."));
    }

    const achievement = await Achievement.findById(id);

    if (!achievement) {
      return res.status(404).json(handler.error("Achievement not found."));
    }

    return res.status(200).json(handler.success(achievement));
  } catch (error) {
    console.error(`Error retrieving achievement by ID: ${req.params.id}`, error);
    return res.status(500).json(handler.error("An unexpected error occurred while retrieving the achievement."));
  }
});

export default app;

import AchievementHandler from "../../handlers/achievement"
import { verifyParams, verifyToken } from "../../server/middleware/verify"
import Achievement from "../../server/models/achievement"
import { getValue } from "../../utils/object"
import { Router } from "express"

const app = Router()
const handler = new AchievementHandler()

/**
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
    const achievements = await Achievement.find() || []
    return res.status(200).send(handler.success(achievements))
})

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
app.get("/:id", verifyToken(), verifyParams(["id"]), async (_, res) => {
    const { keys, values } = res.locals;
    const acievement = await Achievement.findById(getValue(keys, values, "id"))
    if(!acievement)
        return res.status(404).json(handler.error(handler.STATUS_404));
    return res.status(200).json(handler.success(acievement));
})

export default app
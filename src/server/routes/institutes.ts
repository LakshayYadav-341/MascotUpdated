import InstituteHandler from "../../handlers/institute";
import { verifyParams, verifyToken } from "../../server/middleware/verify";
import Institute from "../../server/models/institute";
import { getValue } from "../../utils/object";
import { Router } from "express";

const app = Router();
const handler = new InstituteHandler()

app.get("/", verifyToken(), async (_, res) => {
    const institutes = await Institute.find().populate([
        "admin", "address", "faculty", "courses", "awards"
    ]).exec()
    if(!institutes)
        return res.status(404).json(handler.error(handler.STATUS_404));
    return res.status(200).json(handler.success(institutes));
})

/**
 * @swagger
 * /api/institutes/{id}:
 *   get:
 *     summary: Retrieve an institute by ID
 *     description: Retrieve details of an institute by its ID from the database.
 *     security:
 *       - jwt: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the institute to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A successful response with details of the institute.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Institute'
 *       '404':
 *         description: Institute not found.
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
 *   Institute:
 *     type: object
 *     properties:
 *       // Define properties of the Institute object here
 *   Error:
 *     type: object
 *     properties:
 *       // Define properties of the Error object here
 */


app.get("/:id", verifyToken(), verifyParams(["id"]), async (_, res) => {
    const { keys, values } = res.locals;
    const institute = await Institute.findById(getValue(keys, values, "id")).populate([
        "admin", "address", "faculty", "courses", "awards"
    ]).exec()
    if(!institute)
        return res.status(404).json(handler.error(handler.STATUS_404));
    return res.status(200).json(handler.success(institute));
})

export default app
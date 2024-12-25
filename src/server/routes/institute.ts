import InstituteHandler from "../../handlers/institute";
import { verifyAdmin, verifyBody, verifyParams, verifyToken } from "../../server/middleware/verify";
import Address from "../../server/models/address";
import Institute from "../../server/models/institute";
import Admin from "../../server/models/user/admin";
import IUser from "../../types_/user";
import IAdmin from "../../types_/user/admin";
import { getValue } from "../../utils/object";
import { Router } from "express";

const app = Router()
const handler = new InstituteHandler()

const required = [
    "name",
]

/**
 * @swagger
 * /api/institute/create:
 *   post:
 *     summary: Create a new institute
 *     description: Create a new institute in the database.
 *     security:
 *       - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the institute.
 *               contact:
 *                 type: string
 *                 description: Contact information of the institute.
 *               address:
 *                 $ref: '#/components/schemas/Address'
 *               faculty:
 *                 type: string
 *                 description: The faculty associated with the institute.
 *               courses:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of courses offered by the institute.
 *               awards:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of awards received by the institute.
 *     responses:
 *       '200':
 *         description: Institute created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Institute'
 *       '404':
 *         description: Not found - if address creation fails or if the admin cannot be updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
 */

app.post("/create",
    verifyToken(),
    verifyAdmin(),
    verifyBody(required),
    async (req, res) => {
        const { keys, values, session } = res.locals
        const user = session.user as IUser
        const address = await Address.create(req.body.address)
        if (!address) {
            return res.status(404).send(handler.error(handler.STATUS_404))
        }
        const institute = await Institute.create({
            name: getValue(keys, values, "name"),
            contact: req.body.contact,
            admin: user._id,
            address: address._id,
            ...(keys.includes("faculty") && {
                faculty: getValue(keys, values, "faculty")
            }),
            ...(keys.includes("courses") && {
                courses: getValue(keys, values, "courses")
            }),
            ...(keys.includes("awards") && {
                awards: getValue(keys, values, "awards")
            })
        })
        if (!institute) {
            return res.status(404).send(handler.error(handler.STATUS_404))
        }
        const admin = await Admin.findByIdAndUpdate((user.admin as IAdmin)?._id, { $set: { institute: institute._id } })
        if(!admin) {
            return res.status(404).send(handler.error(handler.STATUS_404))
        }
        return res.status(200).send(handler.success(institute))
    }
)

/**
 * @swagger
 * /api/institute/{id}:
 *   delete:
 *     summary: Delete an institute by ID
 *     description: Delete an institute from the database by its ID.
 *     security:
 *       - jwt: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the institute to delete.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Institute deleted successfully.
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
 *       message:
 *         type: string
 */

app.delete("/:id", verifyToken(), verifyAdmin(), verifyParams(["id"]), async (_, res) => {
    const { keys, values } = res.locals;
    const institute = await Institute.findByIdAndDelete(getValue(keys, values, "id"));
    if (!institute) {
        return res.status(404).send(handler.error(handler.STATUS_404));
    }
    return res.status(200).send(handler.success(institute));
});

export default app
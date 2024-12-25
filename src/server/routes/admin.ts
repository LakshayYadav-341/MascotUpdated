import AdminHandler from "../../handlers/user/admin";
import { verifyAdmin, verifyParams, verifyToken } from "../../server/middleware/verify";
import Institute from "../../server/models/institute";
import User from "../../server/models/user";
import ConnectionRequest from "../../server/models/user/connection-request";
import IUser, { ProfileRoles } from "../../types_/user";
import { ConnectionTypes } from "../../types_/user/connection-request";
import { getValue } from "../../utils/object";
import { Router } from "express";

const app = Router()
const handler = new AdminHandler()

app.put("/connection-request/:request/:status",
    verifyToken(),
    verifyAdmin(),
    verifyParams(["request", "status"]),
    async (_, res) => {
        const { keys, values } = res.locals
        if (!["reject", "accept"].includes((getValue(keys, values, "status") as string))) {
            return res.status(404).send(handler.error(handler.fieldInvalid("status", "The value can be either accpet or reject")))
        }
        const connectionRequest = await ConnectionRequest.findByIdAndDelete(getValue(keys, values, "request"))
        if (!connectionRequest) {
            return res.status(404).send(handler.error("Connection Request not found! Try with a valid request"))
        }
        if (getValue(keys, values, "status") as string === "reject") {
            return res.status(200).send(handler.success({ request: connectionRequest, message: "Successfully rejected the request" }))
        }
        const user = await User.findById(connectionRequest.from)
        if (!user) {
            return res.status(404).send(handler.error(handler.STATUS_404))
        }
        user.role = ProfileRoles.alumni
        const updatedUser = await user.save()
        if (!updatedUser) {
            return res.status(404).send(handler.error(handler.STATUS_404))
        }
        return res.status(200).send({ user: updatedUser, message: "Updated the user from student to alumni" })
    }
)

/**
 * @swagger
 * /api/admin/alumni-requests:
 *   get:
 *     summary: Retrieve all alumni connection requests for the logged-in user
 *     description: Retrieve all alumni connection requests sent to the logged-in user from other users.
 *     security:
 *       - jwt: []
 *     responses:
 *       '200':
 *         description: A successful response with an array of alumni connection requests.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/ConnectionRequest'
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
 *   ConnectionRequest:
 *     type: object
 *     properties:
 *       // Define properties of the ConnectionRequest object here
 */

app.get("/alumni-requests", verifyToken(), verifyAdmin(), async (_, res) => {
    const {session} = res.locals
    const user = (session.user as IUser)._id
    const connectionRequests = await ConnectionRequest.find({ type: ConnectionTypes.alumniRequest, to: user }).populate({
        path: "from",
        select: "-password"
    }).exec() || []
    return res.status(200).send(handler.success(connectionRequests))
})

/**
 * @swagger
 * /api/institutes:
 *   get:
 *     summary: Retrieve all institutes
 *     description: Retrieve all institutes with associated admin users from the database.
 *     security:
 *       - jwt: []
 *     responses:
 *       '200':
 *         description: A successful response with an array of institutes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Institute'
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
 */

app.get("/institutes", verifyToken(), async (_, res) => {
    const institutes = await Institute.find({ admin: { $exists: true } }).populate({
        path: "admin",
        populate: {
            path: "admin",
            select: {
                role: "institute"
            }
        }
    })
    return res.status(200).send(handler.success(institutes))
})

export default app

import JobHandler from "../../handlers/job"
import { verifyParams, verifyToken } from "../../server/middleware/verify"
import Job from "../../server/models/job"
import IUser from "../../types_/user"
import { getValue } from "../../utils/object"
import { Router } from "express"

const app = Router()
const handler = new JobHandler()

app.get("/", verifyToken(), async (_, res) => {
    const {session} = res.locals
    const userId = (session.user as IUser)._id
    const currentTimestamp = Date.now();
    const jobs = await Job.find({
        endsAt: { $gte: currentTimestamp },
        from: { $ne: userId }
    }).populate({ path: "company" }).populate({ path: "from" }).populate({ path: "skills" }).exec() || [];
    return res.status(200).send(jobs)
})

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Retrieve a job by ID
 *     description: Retrieve a job from the database by its ID.
 *     security:
 *       - jwt: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the job to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A successful response with the job details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Job'
 *       '401':
 *         description: Unauthorized. Token is missing or invalid.
 *       '404':
 *         description: The requested job was not found.
 *       '500':
 *         description: Internal Server Error.
 *     examples:
 *       example1:
 *         summary: Example of authorization header
 *         value:
 *           headers:
 *             Authorization: Bearer <JWT-Token>
 * definitions:
 *   Job:
 *     type: object
 *     properties:
 *       // Define properties of the Job object here
 */

app.get("/:id", verifyToken(), verifyParams(["id"]),async (_, res) => {
    const { keys, values } = res.locals;
    const job = await Job.find({ from: getValue(keys, values, "id") }).populate({ path: "company" }).populate({ path: "from" }).populate({ path: "skills" }).exec() || [];
    if (!job)
        return res.status(404).json(handler.error(handler.STATUS_404));
    return res.status(200).json(handler.success(job));
})

/**
 * @swagger
 * /api/jobs/search/{title}:
 *   get:
 *     summary: Search for jobs by title
 *     description: Retrieve jobs matching the given title from the database.
 *     security:
 *       - jwt: []
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         description: Title to search for
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A successful response with an array of jobs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Job'
 *       '400':
 *         description: Bad request. Title parameter is missing.
 *       '404':
 *         description: No jobs found matching the provided title.
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
 *   Job:
 *     type: object
 *     properties:
 *       // Define properties of the Job object here
 */

// Search jobs by title
app.get("/search/:title", verifyToken(), verifyParams(["title"]), async (_, res) => {
    const { keys, values } = res.locals;
    const title = getValue(keys, values, "title")
    if (!title) {
        return res.status(400).json(handler.error(handler.STATUS_404));
    }
    const jobs = await Job.find({
        title: { $regex: new RegExp(title?.toString(), "i") }, // Case-insensitive search
    }).populate({ path: "company" }).populate({ path: "from" }).populate({ path: "skills" }).exec() || [];
    
    if (!jobs) {
        return res.status(404).send(handler.error(handler.STATUS_404))
    }
    return res.status(200).json(handler.success(jobs));
});

export default app
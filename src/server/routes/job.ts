import JobHandler from "../../handlers/job";
import { verifyBody, verifyParams, verifyToken } from "../../server/middleware/verify";
import Job from "../../server/models/job";
import Company from "../../server/models/job/company";
import IUser from "../../types_/user";
import { getValue } from "../../utils/object";
import { Router } from "express";

const app = Router();
const handler = new JobHandler()

/**
 * @swagger
 * /api/job/create:
 *   post:
 *     summary: Create a new job posting
 *     description: Create a new job posting in the database.
 *     security:
 *       - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               company:
 *                 type: string
 *               experienceYears:
 *                 type: number
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               endsAt:
 *                 type: string
 *                 format: date-time
 *               isCompleted:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: A successful response with the created job posting.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Job'
 *       '400':
 *         description: Bad request. Failed to create job posting.
 *       '401':
 *         description: Unauthorized. Token is missing or invalid.
 *       '404':
 *         description: Company not found.
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
 *       _id:
 *         type: string
 *       from:
 *         type: string
 *         description: User ID who posted the job.
 *       title:
 *         type: string
 *       description:
 *         type: string
 *       company:
 *         type: string
 *       experienceYears:
 *         type: number
 *       skills:
 *         type: array
 *         items:
 *           type: string
 *       endsAt:
 *         type: string
 *         format: date-time
 *       isCompleted:
 *         type: boolean
 */

app.post("/create", verifyToken(), verifyBody(["title", "description", "company", "experienceYears"]), async (req, res) => {
    try {
        const { keys, values, session } = res.locals;
        let company = await Company.findOne({ name: getValue(keys, values, "company") });

        if (!company) {
            company = await Company.create({ name: getValue(keys, values, "company") });
        }

        if (!company) {
            return res.status(404).json(handler.error("Company not found or created."));
        }

        const __job = new Job({
            from: (session.user as IUser)._id,
            title: getValue(keys, values, "title"),
            description: getValue(keys, values, "description"),
            company,
            experienceYears: getValue(keys, values, "experienceYears"),
            ...(keys.includes("skills") && { skills: req.body.skills }),
            ...(keys.includes("endsAt") && getValue(keys, values, "endsAt") && { endsAt: getValue(keys, values, "endsAt") }),
            ...(keys.includes("isCompleted") && getValue(keys, values, "isCompleted") && { isCompleted: getValue(keys, values, "isCompleted") })
        });

        __job.set("skills", req.body.skills);
        const job = await __job.save();

        if (!job) {
            return res.status(400).json(handler.error("Failed to create job posting."));
        }

        return res.status(200).json(handler.success(job));
    } catch (error) {
        console.error("Error creating job:", error);
        return res.status(500).json(handler.error("An unexpected error occurred while creating the job."));
    }
});

/**
 * @swagger
 * /api/job/{id}:
 *   delete:
 *     summary: Delete a job by ID
 *     description: Delete a job from the database by its ID.
 *     security:
 *       - jwt: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the job to delete.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully deleted the job.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Job'
 *       '404':
 *         description: Job not found.
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

app.delete("/:id", verifyToken(), verifyParams(["id"]), async (_req, res) => {
    try {
        const { keys, values } = res.locals;
        const job = await Job.findByIdAndDelete(getValue(keys, values, "id"));

        if (!job) {
            return res.status(404).json(handler.error("Job not found."));
        }

        return res.status(200).json(handler.success(job));
    } catch (error) {
        console.error("Error deleting job:", error);
        return res.status(500).json(handler.error("An unexpected error occurred while deleting the job."));
    }
});

export default app;

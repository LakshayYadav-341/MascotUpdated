import InstituteHandler from "../../handlers/institute";
import { verifyParams, verifyToken } from "../../server/middleware/verify";
import Institute from "../../server/models/institute";
import { getValue } from "../../utils/object";
import { Router } from "express";

const app = Router();
const handler = new InstituteHandler();

/**
 * GET /api/institutes
 * Retrieve all institutes.
 */
app.get("/", verifyToken(), async (_req, res) => {
    try {
        const institutes = await Institute.find()
            .populate(["admin", "address", "faculty", "courses", "awards"])
            .exec();

        if (!institutes) {
            return res
                .status(404)
                .json(handler.error("No institutes found in the database."));
        }

        return res.status(200).json(handler.success(institutes));
    } catch (error) {
        console.error("Error fetching institutes:", error);
        return res
            .status(500)
            .json(handler.error("An unexpected error occurred while retrieving institutes."));
    }
});

/**
 * GET /api/institutes/{id}
 * Retrieve an institute by ID.
 */
app.get("/:id", verifyToken(), verifyParams(["id"]), async (_req, res) => {
    try {
        const { keys, values } = res.locals;
        const instituteId = getValue(keys, values, "id");

        const institute = await Institute.findById(instituteId)
            .populate(["admin", "address", "faculty", "courses", "awards"])
            .exec();

        if (!institute) {
            return res
                .status(404)
                .json(handler.error(`Institute with ID ${instituteId} not found.`));
        }

        return res.status(200).json(handler.success(institute));
    } catch (error) {
        console.error("Error fetching institute by ID:", error);
        return res
            .status(500)
            .json(handler.error("An unexpected error occurred while retrieving the institute."));
    }
});

export default app;

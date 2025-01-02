import CourseHandler from "../../handlers/institute/course";
import { verifyBody, verifyToken } from "../../server/middleware/verify";
import Course from "../../server/models/institute/course";
import { getValue } from "../../utils/object";
import { Router } from "express";

const app = Router();
const handler = new CourseHandler();

app.post(
    "/create",
    verifyToken(),
    verifyBody(["name", "batch", "programs", "specialization"]),
    async (req, res) => {
        try {
            const { keys, values } = res.locals;

            // Ensure required fields are provided
            const name = getValue(keys, values, "name");
            const batch = getValue(keys, values, "batch");
            const programs = req.body.programs;
            const specialization = req.body.specialization;

            if (!name || !batch || !programs || !specialization) {
                return res
                    .status(400)
                    .json(handler.error("Required fields are missing"));
            }

            // Create course
            const course = await Course.create({
                name,
                batch,
                programs,
                specialization,
            });

            if (!course) {
                return res
                    .status(500)
                    .json(handler.error("Failed to create the course"));
            }

            return res.status(200).json(handler.success(course));
        } catch (error) {
            console.error("Error creating course:", error);
            return res
                .status(500)
                .json(handler.error("An unexpected error occurred"));
        }
    }
);

export default app;

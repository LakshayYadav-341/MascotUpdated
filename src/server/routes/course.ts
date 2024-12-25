import CourseHandler from "../../handlers/institute/course";
import { verifyBody, verifyToken } from "../../server/middleware/verify";
import Course from "../../server/models/institute/course";
import { getValue } from "../../utils/object";
import { Router } from "express"

const app = Router()
const handler = new CourseHandler();

app.post(
    "/create",
    verifyToken(),
    verifyBody(["name", "batch", "programs", "specialization"]),
    async (req, res) => {
        const { keys, values } = res.locals;
        const course = await Course.create({
            name: getValue(keys, values, "name"),
            batch: getValue(keys, values, "batch"),
            programs: req.body.programs,
            specialization: req.body.specialization
        });
        if(!course)
            return res.status(404).json(handler.error(handler.STATUS_404));
        return res.status(200).json(handler.success(course));
    }
)

export default app

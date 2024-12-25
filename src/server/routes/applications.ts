import JobApplicationHandler from "../../handlers/job/application";
import { verifyParams, verifyToken } from "../../server/middleware/verify";
import JobApplication from "../../server/models/job/application";
import { getValue } from "../../utils/object";
import { Router } from "express";

const app = Router()
const handler = new JobApplicationHandler()


app.get("/job/:job", verifyToken(), verifyParams(["job"]), async (_, res) => {
    const { keys, values } = res.locals
    const applications = await JobApplication.find({
        job: getValue(keys, values, "job")
    }) || []
    return res.status(200).send(handler.success(applications))
})

export default app
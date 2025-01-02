import JobApplicationHandler from "../../handlers/job/application";
import { verifyParams, verifyToken } from "../../server/middleware/verify";
import JobApplication from "../../server/models/job/application";
import { getValue } from "../../utils/object";
import { Router } from "express";

const app = Router();
const handler = new JobApplicationHandler();

app.get("/job/:job", verifyToken(), verifyParams(["job"]), async (_, res) => {
  try {
    const { keys, values } = res.locals;

    const jobId = getValue(keys, values, "job");
    if (!jobId) {
      return res.status(400).json(handler.error("Invalid job ID provided."));
    }

    const applications = await JobApplication.find({ job: jobId });

    if (!applications) {
      return res.status(404).json(handler.error("No job applications found for the specified job ID."));
    }

    return res.status(200).json(handler.success(applications));
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return res
      .status(500)
      .json(handler.error("An unexpected error occurred while retrieving job applications."));
  }
});

export default app;

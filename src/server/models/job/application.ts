import JobApplicationHandler from "../../../handlers/job/application";
import IJobApplication from "../../../types_/job/application";
import { Models } from "../../../utils/models";
import { model, Schema } from "mongoose";

const handler = new JobApplicationHandler()

const jobApplicationSchema = new Schema<IJobApplication>({
    user: {
        type: Schema.Types.ObjectId,
        ref: Models.user,
        required: handler.fieldRequired("user")
    },
    coverLetter: {
        type: String,
        required: handler.fieldRequired("coverLetter")
    },
    resume: {
        type: String,
        required: handler.fieldRequired("resume")
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    job: {
        type: Schema.Types.ObjectId,
        ref: Models.job,
        required: handler.fieldRequired("job")
    }
})

const JobApplication = model(Models.jobApplication, jobApplicationSchema)
export default JobApplication

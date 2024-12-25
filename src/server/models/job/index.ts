import JobHandler from "../../../handlers/job";
import IJob from "../../../types_/job";
import { Models } from "../../../utils/models";
import { Schema, model } from "mongoose";

const handler = new JobHandler();

const jobSchema = new Schema<IJob>({
    from: {
        type: Schema.Types.ObjectId,
        ref: Models.user,
        required: handler.fieldRequired("from"),
    },
    title: {
        type: String,
        required: handler.fieldRequired("title"),
    },
    skills: [{
        type: Schema.Types.ObjectId,
        ref: Models.skill,
        default: []
    }],
    description: {
        type: String,
        required: handler.fieldRequired("description"),
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    endsAt: Date,
    company: {
        type: Schema.Types.ObjectId,
        ref: Models.company,
        required: handler.fieldRequired("company"),
    },
    experienceYears: {
        type: Number,
        required: handler.fieldRequired("experienceYears"),
    },
});

const Job = model(Models.job, jobSchema);
export default Job;

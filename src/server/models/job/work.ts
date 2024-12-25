import WorkHandler from "../../../handlers/job/work";
import IWork from "../../../types_/job/work";
import { Models } from "../../../utils/models";
import { Schema, model } from "mongoose";

const handler = new WorkHandler()

const workSchema = new Schema<IWork>({
    company: {
        type: Schema.Types.ObjectId,
        ref: Models.company,
        required: handler.fieldRequired("company")
    },
    from: {
        type: Date,
        required: handler.fieldRequired("from")
    },
    isCurrent: {
        type: Boolean,
        required: handler.fieldRequired("isCurrent")
    },
    to: Date,
    name: {
        type: String,
        required: handler.fieldRequired("name")
    }
})

const Work = model(Models.work, workSchema)
export default Work
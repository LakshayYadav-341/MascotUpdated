import EducationHandler from "../../../handlers/user/education";
import IEducation, { EducationTypes } from "../../../types_/user/education";
import { Models } from "../../../utils/models";
import { Schema, model } from "mongoose";

const handler = new EducationHandler()

const educationSchema = new Schema<IEducation>({
    institute: {
        type: Schema.Types.ObjectId,
        ref: Models.institute,
        required: handler.fieldRequired("institute")
    },
    type: {
        type: String,
        enum: Object.values(EducationTypes),
        required: handler.fieldRequired("type")
    },
    joined: {
        type: Date,
        required: handler.fieldRequired("joined")
    },
    completion: {
        type: {
            isCurrent: {
                type: Boolean,
                required: handler.fieldRequired("completion.isCurrent")
            },
            completed: Date
        },
        required: handler.fieldRequired("completion")
    },
    remarks: String
})

const Education = model(Models.education, educationSchema)
export default Education
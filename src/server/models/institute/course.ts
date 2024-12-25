import CourseHandler from "../../../handlers/institute/course";
import ICourse from "../../../types_/institute/course";
import { Models } from "../../../utils/models";
import { model, Schema } from "mongoose";

const handler = new CourseHandler()

const courseSchema = new Schema<ICourse>({
    name: {
        type: String,
        required: handler.fieldRequired("name")
    },
    batch: {
        type: String,
        required: handler.fieldRequired("batch")
    },
    programs: {
        default: [],
        type: [{
            name: {
                type: String,
                required: handler.fieldRequired("programs.name"),
            },
            curriculum: {
                type: [String],
                default: []
            }
        }]
    },
    specialization: {
        type: {
            name: {
                type: String,
                required: handler.fieldRequired("specialization.name")
            },
            curriculum: {
                type: [String],
                default: []
            }
        },
        required: handler.fieldRequired("specialization")
    }
})

const Course = model(Models.course, courseSchema)
export default Course
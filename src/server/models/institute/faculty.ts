import FacultyHandler from "../../../handlers/institute/faculty";
import IFaculty from "../../../types_/institute/faculty";
import { Models } from "../../../utils/models";
import { model, Schema } from "mongoose";

const handler = new FacultyHandler()

const facultySchema = new Schema<IFaculty>({
    name: {
        type: String,
        required: handler.fieldRequired("name")
    },
    contact: {
        type: {
            emails: {
                type: [String],
                required: handler.fieldRequired("contact.emails"),
                validate: {
                    validator: handler.isEmailArray,
                    message: handler.emailsArrayMessage
                }
            },
            phone: {
                type: [String],
                required: handler.fieldRequired("contact.phones"),
                validate: {
                    validator: handler.isPhoneArray,
                    message: handler.phoneArrayMessage
                }
            },
            social: {
                type: {
                    facebook: String,
                    instagram: String,
                    x: String,
                    quora: String,
                    others: [[String, String]]
                },
                required: handler.fieldRequired("contact.social")
            }
        },
        required: handler.fieldRequired("contact")
    },
    previousWorks: {
        type: [{
            institute: {
                type: Schema.Types.ObjectId,
                ref: Models.faculty,
                required: handler.fieldRequired("previousWorks.institute")
            },
            from: {
                type: Date,
                required: handler.fieldRequired("previousWorks.from")
            },
            to: {
                type: Date,
                required: handler.fieldRequired("previousWorks.to")
            }
        }],
        default: []
    },
    isPartTime: {
        type: Boolean,
        default: false
    },
    joinedDate: {
        type: Date,
        default: Date.now
    },
    achievements: {
        type: [Schema.Types.ObjectId],
        ref: Models.achievement,
        default: []
    }
})

const Faculty = model(Models.faculty, facultySchema)
export default Faculty
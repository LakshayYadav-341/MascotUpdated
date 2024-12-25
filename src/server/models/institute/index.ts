import InstituteHandler from "../../../handlers/institute";
import IInstitute from "../../../types_/institute";
import { Models } from "../../../utils/models";
import { model, Schema } from "mongoose";

const handler = new InstituteHandler()

const instituteSchema = new Schema<IInstitute>({
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
    admin: {
        type: Schema.Types.ObjectId,
        ref: Models.user,
        required: handler.fieldRequired("admin")
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: Models.address,
        required: handler.fieldRequired("address")
    },
    faculty: [{
        type: Schema.Types.ObjectId,
        ref: Models.user,
        default: []
    }],
    courses: [{
        type: Schema.Types.ObjectId,
        ref: Models.course,
        default: []
    }],
    awards: [{
        type: Schema.Types.ObjectId,
        ref: Models.achievement,
        default: []
    }]
})

const Institute = model(Models.institute, instituteSchema)
export default Institute
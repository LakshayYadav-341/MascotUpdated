import SessionHandler from "../../../handlers/user/session";
import ISession from "../../../types_/user/session";
import { Models } from "../../../utils/models";
import { Schema, model } from "mongoose";

const handler = new SessionHandler()

const sessionSchema = new Schema<ISession>({
    user: {
        type: Schema.Types.ObjectId,
        ref: Models.user,
        required: handler.fieldRequired("user")
    },
    token: {
        type: String,
        required: handler.fieldRequired("token"),
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Session = model(Models.session, sessionSchema)
export default Session
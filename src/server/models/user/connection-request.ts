import ConnectionRequestHandler from "../../../handlers/user/connection-request"
import IConnectionRequest, { ConnectionTypes } from "../../../types_/user/connection-request"
import { Models } from "../../../utils/models"
import { model, Schema } from "mongoose"

const handler = new ConnectionRequestHandler()

const connectionRequestSchema = new Schema<IConnectionRequest>({
    from: {
        type: Schema.Types.ObjectId,
        ref: Models.user,
        required: handler.fieldRequired("from")
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: Models.user,
        required: handler.fieldRequired("to")
    },
    type: {
        type: String,
        required: handler.fieldRequired("type"),
        enum: Object.values(ConnectionTypes)
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    document: String,
    institute: {
        type: Schema.Types.ObjectId,
        ref: Models.institute
    }
})

const ConnectionRequest = model(Models.connectionRequest, connectionRequestSchema)
export default ConnectionRequest
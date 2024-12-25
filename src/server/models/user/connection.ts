import IConnection from "../../../types_/user/connection"
import { Models } from "../../../utils/models"
import { model, Schema } from "mongoose"

// const handler = new ConnectionHandler()

const connectionSchema = new Schema<IConnection>({
    users: [{
        type: Schema.Types.ObjectId,
        ref: Models.user
    }]
})

const Connection = model(Models.connection, connectionSchema)
export default Connection
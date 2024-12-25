import InteractionHandler from "../../../handlers/feed/interaction"
import IInteraction, { InteractionType } from "../../../types_/feed/interaction"
import { Models } from "../../../utils/models"
import { model, Schema } from "mongoose"

const handler = new InteractionHandler()

const interactionSchema = new Schema<IInteraction>({
    post: {
        type: Schema.Types.ObjectId,
        ref: Models.post,
        required: handler.fieldRequired("post")
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: Models.user,
        required: handler.fieldRequired("user")
    },
    type: {
        type: String,
        enum: Object.values(InteractionType),
        required: handler.fieldRequired("type")
    },
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Interaction = model(Models.interaction, interactionSchema)
export default Interaction
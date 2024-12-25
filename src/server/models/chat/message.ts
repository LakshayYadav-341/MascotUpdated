import IMessage from "../../../types_/chat/message";
import { model, Schema } from "mongoose";
import { Models } from "../../../utils/models";

const MessageSchema = new Schema<IMessage>({
    chat: {
        type: Schema.Types.ObjectId,
        ref: Models.chat
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: Models.user
    },
    message:{
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Message = model(Models.message, MessageSchema)
export default Message;
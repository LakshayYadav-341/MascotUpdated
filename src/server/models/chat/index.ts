import IChat from "../../../types_/chat";
import { model, Schema } from "mongoose";
import { Models } from "../../../utils/models";

const chatSchema = new Schema<IChat>({
    name: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    isGroup: {
        type: Boolean,
        default: false
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: Models.user
    }]
})

const Chat = model(Models.chat, chatSchema)
export default Chat;
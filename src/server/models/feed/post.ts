import PostHandler from "../../../handlers/feed/post";
import IPost from "../../../types_/feed/post";
import { Models } from "../../../utils/models";
import { model, Schema } from "mongoose";

const handler = new PostHandler()

const postSchema = new Schema<IPost>({
    user: {
        type: Schema.Types.ObjectId,
        ref: Models.user,
        required: handler.fieldRequired("user")
    },
    content: {
        type: {
            text: {
                type: String,
                required: handler.fieldRequired("content.text")
            },
            media: {
                type: [String],
                default: []
            }
        },
        required: handler.fieldRequired("content")
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    institute: {
        type: Schema.Types.ObjectId,
        ref: Models.institute
    }
})

const Post = model(Models.post, postSchema)
export default Post
import IReportedPost from "../../../types_/feed/reported-post"
import { Models } from "../../../utils/models"
import { model, Schema } from "mongoose"
import ReportedPostHandler from "../../../handlers/feed/reported-post"

const handler = new ReportedPostHandler()

const reportedPostSchema = new Schema<IReportedPost>({
    post: {
        type: Schema.Types.ObjectId,
        ref: Models.post,
        required: handler.fieldRequired("post")
    }, 
    by: {
        type: Schema.Types.ObjectId,
        ref: Models.user
    },
    reason: String
})

const ReportedPost = model(Models.reportedPost, reportedPostSchema)
export default ReportedPost
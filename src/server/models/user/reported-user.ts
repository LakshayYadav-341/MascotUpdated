import IReportedUser from "../../../types_/user/reported-user"
import { Models } from "../../../utils/models"
import { model, Schema } from "mongoose"
import ReportedUserHandler from "../../../handlers/user/reported-user"

const handler = new ReportedUserHandler()

const reportedUserSchema = new Schema<IReportedUser>({
    user: {
        type: Schema.Types.ObjectId,
        ref: Models.user,
        required: handler.fieldRequired("user")
    }, 
    by: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: Models.user
        },
        reason:{
            type: String
        }
    }]
})

const ReportedUser = model(Models.reportedUser, reportedUserSchema)
export default ReportedUser
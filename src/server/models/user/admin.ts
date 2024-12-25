import AdminHandler from "../../../handlers/user/admin"
import IAdmin from "../../../types_/user/admin"
import { Models } from "../../../utils/models"
import { model, Schema } from "mongoose"

const handler = new AdminHandler()

const adminSchema = new Schema<IAdmin>({
    role: {
        type: String,
        required: handler.fieldRequired("role")
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: Models.user
    },
    institute: {
        type: Schema.Types.ObjectId,
        ref: Models.institute
    }
})

const Admin = model(Models.admin, adminSchema)
export default Admin
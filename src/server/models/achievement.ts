import IAchievement from "../../types_/achievement"
import { model, Schema } from "mongoose"
import AchievementHandler from "../../handlers/achievement"
import { Models } from "../../utils/models"

const handler = new AchievementHandler()

const achievementSchema = new Schema<IAchievement>({
    info: {
        type: String,
        required: handler.fieldRequired("info")
    },
    description: String,
    documents: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Achievement = model(Models.achievement, achievementSchema)
export default Achievement
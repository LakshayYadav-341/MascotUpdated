import IAchievement from "../types_/achievement";
import { ErrorHandler } from "./error";
import { Models } from "../utils/models"

export default class AchievementHandler extends ErrorHandler<IAchievement> {
    constructor() {
        super(Models.achievement)
    }
}
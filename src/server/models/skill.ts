import { ErrorHandler } from "../../handlers/error";
import ISkill from "../../types_/skill";
import { Models } from "../../utils/models";
import { model, Schema } from "mongoose";

const handler = new ErrorHandler<ISkill>(Models.skill)

const skillSchema = new Schema<ISkill>({
    name: {
        type: String,
        required: handler.fieldRequired("name")
    }
})

const Skill = model(Models.skill, skillSchema)
export default Skill
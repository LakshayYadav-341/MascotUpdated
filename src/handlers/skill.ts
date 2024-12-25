import ISkill from "../types_/skill";
import { ErrorHandler } from "./error";
import { Models } from "../utils/models";

export default class SkillHandler extends ErrorHandler<ISkill> {
    constructor() {
        super(Models.skill);
    }
}

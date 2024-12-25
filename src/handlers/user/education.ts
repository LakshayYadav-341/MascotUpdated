import { ErrorHandler } from "../../handlers/error";
import IEducation from "../../types_/user/education";
import { Models } from "../../utils/models";

export default class EducationHandler extends ErrorHandler<IEducation> {
    constructor() {
        super(Models.education)
    }
}
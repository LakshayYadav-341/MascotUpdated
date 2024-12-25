import { ErrorHandler } from "../../handlers/error";
import ICourse from "../../types_/institute/course";
import { Models } from "../../utils/models";

export default class CourseHandler extends ErrorHandler<ICourse> {
    constructor() {
        super(Models.course)
    }
}
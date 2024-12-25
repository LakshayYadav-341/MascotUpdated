import { ErrorHandler } from "../../handlers/error";
import IJobApplication from "../../types_/job/application";
import { Models } from "../../utils/models";

export default class JobApplicationHandler extends ErrorHandler<IJobApplication> {
    constructor() {
        super(Models.jobApplication)
    }
}
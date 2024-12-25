import { ErrorHandler } from "../../handlers/error";
import IJob from "../../types_/job";
import { Models } from "../../utils/models";

export default class JobHandler extends ErrorHandler<IJob> {
    constructor() {
        super(Models.job)
    }
}
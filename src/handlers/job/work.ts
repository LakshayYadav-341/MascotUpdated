import { ErrorHandler } from "../../handlers/error";
import IWork from "../../types_/job/work";
import { Models } from "../../utils/models";

export default class WorkHandler extends ErrorHandler<IWork> {
    constructor() {
        super(Models.work)
    }
}
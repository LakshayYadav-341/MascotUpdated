import { ErrorHandler } from "../../handlers/error";
import IReportedUser from "../../types_/user/reported-user";
import { Models } from "../../utils/models";

export default class ReportedUserHandler extends ErrorHandler<IReportedUser> {
    constructor() {
        super(Models.reportedUser)
    }
}
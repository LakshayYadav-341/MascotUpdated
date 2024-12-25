import { ErrorHandler } from "../../handlers/error";
import IReportedPost from "../../types_/feed/reported-post";
import { Models } from "../../utils/models";

export default class ReportedPostHandler extends ErrorHandler<IReportedPost> {
    constructor() {
        super(Models.reportedPost)
    }
}
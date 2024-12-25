import { ErrorHandler } from "../../handlers/error";
import ISession from "../../types_/user/session";
import { Models } from "../../utils/models";

export default class SessionHandler extends ErrorHandler<ISession> {
    constructor() {
        super(Models.session)
    }
}
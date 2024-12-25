import { ErrorHandler } from "../../handlers/error";
import IUser from "../../types_/user";
import { Models } from "../../utils/models";

export default class UserHandler extends ErrorHandler<IUser> {
    constructor() {
        super(Models.user)
    }
}
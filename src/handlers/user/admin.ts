import { ErrorHandler } from "../../handlers/error";
import IAdmin from "../../types_/user/admin";
import { Models } from "../../utils/models";

export default class AdminHandler extends ErrorHandler<IAdmin> {
    constructor() {
        super(Models.admin)
    }
}
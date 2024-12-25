import { ErrorHandler } from "../../handlers/error";
import IProfile from "../../types_/user/profile";
import { Models } from "../../utils/models";

export default class ProfileHandler extends ErrorHandler<IProfile> {
    constructor() {
        super(Models.profile)
    }
}
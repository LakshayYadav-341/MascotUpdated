import { ErrorHandler } from "../../handlers/error";
import IChat from "../../types_/chat";
import { Models } from "../../utils/models";

export default class ChatHandler extends ErrorHandler<IChat> {
    constructor() {
        super(Models.chat)
    }
}
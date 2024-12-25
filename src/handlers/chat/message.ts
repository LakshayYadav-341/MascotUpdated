import { ErrorHandler } from "../../handlers/error";
import IMessage from "../../types_/chat/message";
import { Models } from "../../utils/models";

export default class MessageHandler extends ErrorHandler<IMessage> {
    constructor() {
        super(Models.message)
    }
}
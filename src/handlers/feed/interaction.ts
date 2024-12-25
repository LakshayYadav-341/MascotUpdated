import { ErrorHandler } from "../../handlers/error";
import IInteraction from "../../types_/feed/interaction";
import { Models } from "../../utils/models";

export default class InteractionHandler extends ErrorHandler<IInteraction> {
    constructor() {
        super(Models.interaction)
    }
}
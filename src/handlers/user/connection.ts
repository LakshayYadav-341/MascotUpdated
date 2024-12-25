import { ErrorHandler } from "../../handlers/error";
import IConnection from "../../types_/user/connection";
import { Models } from "../../utils/models";

export default class ConnectionHandler extends ErrorHandler<IConnection> {
    constructor() {
        super(Models.connection)
    }

    readonly CONNECTION_LENGTH = "The connection has to be made between 2 users only. Not more not less."
}
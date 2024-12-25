import { ErrorHandler } from "../../handlers/error";
import IConnectionRequest from "../../types_/user/connection-request";
import { Models } from "../../utils/models";

export default class ConnectionRequestHandler extends ErrorHandler<IConnectionRequest> {
    constructor() {
        super(Models.connectionRequest)
    }
}
import IAddress from "../types_/address";
import { ErrorHandler } from "./error";
import { Models } from "../utils/models"

export default class AddressHandler extends ErrorHandler<IAddress> {
    constructor() {
        super(Models.address)
    }
}
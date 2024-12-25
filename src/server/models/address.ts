import IAddress from "../../types_/address";
import { Models } from "../../utils/models";
import { model, Schema } from "mongoose";
import AddressHandler from "../../handlers/address";

const handler = new AddressHandler()

const addressSchema = new Schema<IAddress>({
    name: String,
    buildingName: String,
    line1: {
        type: String,
        required: handler.fieldRequired("line1")
    },
    line2: String,
    street: {
        type: String,
        required: handler.fieldRequired("street")
    },
    landmark: String,
    city: {
        type: String,
        required: handler.fieldRequired("city")
    },
    state: {
        type: String,
        required: handler.fieldRequired("state")
    },
    country: {
        type: String,
        required: handler.fieldRequired("country")
    },
    pinCode: {
        type: Number,
        required: handler.fieldRequired("pinCode")
    }
})

const Address = model(Models.address, addressSchema)
export default Address
import AddressHandler from "../../handlers/address";
import { verifyBody, verifyToken } from "../../server/middleware/verify";
import Address from "../../server/models/address";
import { getValue } from "../../utils/object";
import { Router } from "express";

const app = Router();
const handler = new AddressHandler();

const required = ["line1", "street", "city", "state", "pinCode"];

app.post("/create", verifyToken(), verifyBody(required), async (_, res) => {
  try {
    const { keys, values } = res.locals;

    // Create address document
    const address = await Address.create({
      ...(keys.includes("name") && {
        name: getValue(keys, values, "name"),
      }),
      ...(keys.includes("buildingName") && {
        buildingName: getValue(keys, values, "buildingName"),
      }),
      line1: getValue(keys, values, "line1"),
      ...(keys.includes("line2") && {
        line2: getValue(keys, values, "line2"),
      }),
      street: getValue(keys, values, "street"),
      ...(keys.includes("landmark") && {
        landmark: getValue(keys, values, "landmark"),
      }),
      city: getValue(keys, values, "city"),
      state: getValue(keys, values, "state"),
      pinCode: getValue(keys, values, "pinCode"),
    });

    if (!address) {
      return res.status(500).json(handler.error("Failed to create address."));
    }

    return res.status(200).json(handler.success(address));
  } catch (error) {
    console.error("Error in address creation:", error);
    return res
      .status(500)
      .json(handler.error("An unexpected error occurred while creating the address."));
  }
});

export default app;

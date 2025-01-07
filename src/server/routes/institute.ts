import InstituteHandler from "../../handlers/institute";
import { verifyAdmin, verifyBody, verifyParams, verifyToken } from "../../server/middleware/verify";
import Address from "../../server/models/address";
import Institute from "../../server/models/institute";
import Admin from "../../server/models/user/admin";
import IUser from "../../types_/user";
import IAdmin from "../../types_/user/admin";
import { getValue } from "../../utils/object";
import { Router } from "express";

const app = Router();
const handler = new InstituteHandler();

const required = ["name"];

app.post(
    "/create",
    verifyToken(),
    verifyAdmin(),
    verifyBody(required),
    async (req, res) => {
        try {
            const { keys, values, session } = res.locals;
            const user = session.user as IUser;

            // Create the address
            const address = await Address.create(req.body.address);
            if (!address || !req.body.contact) {
                return res.status(400).send(handler.error("Failed to create address."));
            }

            // Create the institute
            const institute = await Institute.create({
                name: getValue(keys, values, "name"),
                contact: req?.body?.contact,
                admin: user._id,
                address: address._id,
                ...(keys.includes("faculty") && { faculty: getValue(keys, values, "faculty") }),
                ...(keys.includes("courses") && { courses: getValue(keys, values, "courses") }),
                ...(keys.includes("awards") && { awards: getValue(keys, values, "awards") }),
            });

            if (!institute) {
                return res.status(500).send(handler.error("Failed to create institute."));
            }

            // Update the admin with the new institute
            const admin = await Admin.findByIdAndUpdate(
                (user.admin as IAdmin)?._id,
                { $set: { institute: institute._id } },
                { new: true }
            );

            if (!admin) {
                return res.status(500).send(handler.error("Failed to update admin with institute."));
            }

            return res.status(200).send(handler.success(institute));
        } catch (error) {
            console.error("Error creating institute:", error);
            return res.status(500).send(handler.error("An unexpected error occurred."));
        }
    }
);

app.delete("/:id", verifyToken(), verifyAdmin(), verifyParams(["id"]), async (_req, res) => {
    try {
        const { keys, values } = res.locals;

        // Find and delete the institute
        const institute = await Institute.findByIdAndDelete(getValue(keys, values, "id"));
        if (!institute) {
            return res.status(404).send(handler.error("Institute not found."));
        }

        return res.status(200).send(handler.success(institute));
    } catch (error) {
        console.error("Error deleting institute:", error);
        return res.status(500).send(handler.error("An unexpected error occurred."));
    }
});

export default app;
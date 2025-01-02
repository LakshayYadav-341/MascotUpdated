import CompanyHandler from "../../handlers/job/company";
import { verifyBody, verifyToken } from "../../server/middleware/verify";
import Company from "../../server/models/job/company";
import { getValue } from "../../utils/object";
import { Router } from "express";

const app = Router();
const handler = new CompanyHandler();

/**
 * @swagger
 * /api/company/create:
 *   post:
 *     summary: Create a new company
 *     description: Create a new company with the provided name and optional description.
 *     security:
 *       - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the company.
 *               description:
 *                 type: string
 *                 description: (Optional) A description of the company.
 *     responses:
 *       '200':
 *         description: A successful response with the created company object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Company'
 *       '401':
 *         description: Unauthorized. Token is missing or invalid.
 *       '404':
 *         description: Not Found. The company could not be created.
 *       '500':
 *         description: Internal Server Error.
 *     examples:
 *       example1:
 *         summary: Example of authorization header
 *         value:
 *           headers:
 *             Authorization: Bearer <JWT-Token>
 * definitions:
 *   Company:
 *     type: object
 *     properties:
 *       // Define properties of the Company object here
 */

app.post(
    "/create",
    verifyToken(),
    verifyBody(["name"]),
    async (_, res) => {
        try {
            const { keys, values } = res.locals;
            const company = await Company.create({
                name: getValue(keys, values, "name"),
                ...(
                    keys.includes("description") &&
                    getValue(keys, values, "description") &&
                    (getValue(keys, values, "description") as string).length &&
                    {
                        description: getValue(keys, values, "description")
                    }
                )
            });

            if (!company) {
                return res.status(404).send(handler.error("Failed to create the company."));
            }

            return res.status(200).send(handler.success(company));
        } catch (error) {
            console.error("Error in POST /create:", error);
            return res.status(500).send(handler.error("Internal Server Error"));
        }
    }
);

export default app;

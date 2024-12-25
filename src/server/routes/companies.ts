import CompanyHandler from "../../handlers/job/company";
import { verifyToken } from "../../server/middleware/verify";
import Company from "../../server/models/job/company";
import { Router } from "express";

const app = Router();
const handler = new CompanyHandler();

/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Retrieve all companies
 *     description: Retrieve all companies from the database.
 *     security:
 *       - jwt: []
 *     responses:
 *       '200':
 *         description: A successful response with an array of companies.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Company'
 *       '401':
 *         description: Unauthorized. Token is missing or invalid.
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


app.get("/", verifyToken(), async (_, res) => {
    const companies = (await Company.find()) || [];
    return res.status(200).send(handler.success(companies));
});

export default app;

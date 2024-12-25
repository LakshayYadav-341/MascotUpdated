import NewsHandler from "../../handlers/feed/news";
import { verifyAdmin, verifyBody, verifyParams, verifyToken } from "../../server/middleware/verify";
import News from "../../server/models/feed/news";
import { getValue } from "../../utils/object";
import { Router } from "express";

const app = Router();
const handler = new NewsHandler();

const required = ["title"];
/**
 * @swagger
 * /api/news/create:
 *   post:
 *     summary: Create a new news item
 *     description: Create a new news item in the database.
 *     security:
 *       - jwt: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response with the created news item.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/News'
 *       '401':
 *         description: Unauthorized. Token is missing or invalid.
 *       '404':
 *         description: Not Found. The requested resource was not found.
 *       '500':
 *         description: Internal Server Error.
 *     examples:
 *       example1:
 *         summary: Example of authorization header
 *         value:
 *           headers:
 *             Authorization: Bearer <JWT-Token>
 * definitions:
 *   News:
 *     type: object
 *     properties:
 *       // Define properties of the News object here
 */

app.post("/create", verifyToken(), verifyAdmin(), verifyBody(required), async (_, res) => {
    const { keys, values } = res.locals;
    const news = await News.create({
        title: getValue(keys, values, "title"),
        description: getValue(keys, values, "description"),
    });
    if (!news) {
        return res.status(404).send(handler.error(handler.STATUS_404));
    }
    return res.status(200).send(handler.success(news));
});

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Retrieve all news
 *     description: Retrieve all news from the database.
 *     security:
 *       - jwt: []
 *     responses:
 *       '200':
 *         description: A successful response with an array of news.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/News'
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
 *   News:
 *     type: object
 *     properties:
 *       // Define properties of the News object here
 */


app.get("/", verifyToken(), async (_, res) => {
    const newsList = await News.find();
    return res.status(200).send(handler.success(newsList));
});

/**
 * @swagger
 * /api/news/{id}:
 *   get:
 *     summary: Retrieve news by ID
 *     description: Retrieve news by its unique identifier.
 *     security:
 *       - jwt: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the news item to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A successful response with the requested news item.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/News'
 *       '404':
 *         description: Not Found. The requested news item does not exist.
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
 *   News:
 *     type: object
 *     properties:
 *       // Define properties of the News object here
 */


app.get("/:id", verifyToken(), async (req, res) => {
    const newsId = req.params.id;
    const news = await News.findById(newsId);
    if (!news) {
        return res.status(404).send(handler.error(handler.STATUS_404));
    }
    return res.status(200).send(handler.success(news));
});

/**
 * @swagger
 * /api/news/{id}:
 *   put:
 *     summary: Update a news item by ID
 *     description: Update a news item in the database by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the news item to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - title
 *               - description
 *     security:
 *       - jwt: []
 *     responses:
 *       '200':
 *         description: Successfully updated the news item.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/News'
 *       '400':
 *         description: Bad request. Required fields are missing in the request body.
 *       '401':
 *         description: Unauthorized. Token is missing or invalid.
 *       '404':
 *         description: Not found. The requested news item does not exist.
 *       '500':
 *         description: Internal Server Error.
 *     examples:
 *       example1:
 *         summary: Example of authorization header
 *         value:
 *           headers:
 *             Authorization: Bearer <JWT-Token>
 * definitions:
 *   News:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       title:
 *         type: string
 *       description:
 *         type: string
 *       createdAt:
 *         type: string
 *         format: date-time
 *       updatedAt:
 *         type: string
 *         format: date-time
 */

app.put("/:id", verifyToken(), verifyAdmin(), verifyBody(required), async (req, res) => {
    const newsId = req.params.id;
    const { keys, values } = res.locals;
    const news = await News.findByIdAndUpdate(
        newsId,
        {
            title: getValue(keys, values, "title"),
            description: getValue(keys, values, "description"),
        },
        { new: true }
    );
    if (!news) {
        return res.status(404).send(handler.error(handler.STATUS_404));
    }
    return res.status(200).send(handler.success(news));
});

/**
 * @swagger
 * /api/news/{id}:
 *   delete:
 *     summary: Delete a news item by ID
 *     description: Delete a news item from the database by its ID.
 *     security:
 *       - jwt: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the news item to delete.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A successful response with the deleted news item.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/News'
 *       '401':
 *         description: Unauthorized. Token is missing or invalid.
 *       '404':
 *         description: Not Found. The news item with the specified ID was not found.
 *       '500':
 *         description: Internal Server Error.
 *     examples:
 *       example1:
 *         summary: Example of authorization header
 *         value:
 *           headers:
 *             Authorization: Bearer <JWT-Token>
 * definitions:
 *   News:
 *     type: object
 *     properties:
 *       // Define properties of the News object here
 */


app.delete("/:id", verifyToken(), verifyAdmin(), verifyParams(["id"]), async (_req, res) => {
    const { keys, values } = res.locals
    const news = await News.findByIdAndDelete(getValue(keys, values, "id"));
    if (!news) {
        return res.status(404).send(handler.error(handler.STATUS_404));
    }
    return res.status(200).send(handler.success(news));
});

export default app;

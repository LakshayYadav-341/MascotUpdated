import { verifyBody, verifyParams, verifyToken } from "../../server/middleware/verify";
import IUser from "../../types_/user";
import { getValue } from "../../utils/object";
import { Router } from "express";
import Message from "../../server/models/chat/message";
import MessageHandler from "../../handlers/chat/message";

const app = Router();

const handler = new MessageHandler();

const required = ["chatId", "message"]
app.post("/", verifyToken(), verifyBody(required), async(_, res)=>{
    const {keys, values, session} = res.locals; 
    const user = (session.user as IUser)._id.toString();
    const chatId = getValue(keys, values, "chatId");
    const message = getValue(keys, values, "message");

    const newMessage = await Message.create({
        chat: chatId,
        sender: user,
        message: message
    })
    if(!newMessage){
        return res.status(404).send(handler.error(handler.STATUS_404))
    }
    return res.status(200).send(handler.success(newMessage))
})

/**
 * @swagger
 * /api/message/{chatId}:
 *   get:
 *     summary: Retrieve messages by chat ID
 *     description: Retrieve messages belonging to a specific chat based on the provided chat ID.
 *     security:
 *       - jwt: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         description: The ID of the chat to retrieve messages from.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: A successful response with an array of messages belonging to the specified chat.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Message'
 *       '404':
 *         description: Not Found. No messages found for the specified chat ID.
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
 *   Message:
 *     type: object
 *     properties:
 *       // Define properties of the Message object here
 */

app.get("/:chatId", verifyToken(), verifyParams(["chatId"]), async(_, res)=>{
    const {keys, values} = res.locals;
    const chatId = getValue(keys, values, "chatId");
    const messages = await Message.find({
        chat: chatId
    })
    if(!messages){
        return res.status(404).send(handler.error(handler.STATUS_404))
    }
    return res.status(200).send(handler.success(messages))
})

export default app;
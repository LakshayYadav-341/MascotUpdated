import { verifyBody, verifyParams, verifyToken } from "../../server/middleware/verify";
import IUser from "../../types_/user";
import { getValue } from "../../utils/object";
import { Router } from "express";
import Chat from "../../server/models/chat";
import ChatHandler from "../../handlers/chat";
import User from "../../server/models/user";

const app = Router();

const handler = new ChatHandler();

const required = ["user"]
app.post("/", verifyToken(), verifyBody(required), async(_, res)=>{
    const {keys, values, session} = res.locals; 
    const user = (session.user as IUser)._id.toString();
    const otherUser = getValue(keys, values, "user");
    const newChat = await Chat.create({
        members: [user, otherUser],
    })
    if(!newChat){
        return res.status(404).send(handler.error(handler.STATUS_404))
    }
    const tempUser = await User.findById(otherUser)
    if(!tempUser){
        return res.status(404).send("User not Found!!")
    }
    const resData = {
        _id: newChat._id,
        members: [session.user, tempUser]
    }
    return res.status(200).send(handler.success(resData))
})

/**
 * @swagger
 * /api/chat/find:
 *   get:
 *     summary: Retrieve chats for the authenticated user
 *     description: Retrieve chats where the authenticated user is a member.
 *     security:
 *       - jwt: []
 *     responses:
 *       '200':
 *         description: A successful response with an array of chats.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Chat'
 *       '401':
 *         description: Unauthorized. Token is missing or invalid.
 *       '404':
 *         description: Not Found. No chats found for the user.
 *       '500':
 *         description: Internal Server Error.
 *     examples:
 *       example1:
 *         summary: Example of authorization header
 *         value:
 *           headers:
 *             Authorization: Bearer <JWT-Token>
 * definitions:
 *   Chat:
 *     type: object
 *     properties:
 *       // Define properties of the Chat object here
 */


app.get("/find", verifyToken(), async(_, res)=>{
    const {session} = res.locals;
    console.log(session);
    
    const userId = (session.user as IUser)._id;
    const chat = await Chat.find({members: {$in: userId}}).populate([
        { path: "members" },
    ]).exec() || [];
    if(!chat){
        return res.status(404).send(handler.error(handler.STATUS_404))
    }
    return res.status(200).send(handler.success(chat))
})

/**
 * @swagger
 * /api/chat/find/{userId}:
 *   get:
 *     summary: Find chat by user ID
 *     description: Retrieve a chat by the ID of the user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user to find the chat for.
 *         schema:
 *           type: string
 *     security:
 *       - jwt: []
 *     responses:
 *       '200':
 *         description: A successful response with the chat data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Chat'
 *       '404':
 *         description: Chat not found.
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
 *   Chat:
 *     type: object
 *     properties:
 *       // Define properties of the Chat object here
 */

app.get("/find/:userId", verifyToken(), verifyParams(["userId"]), async(_, res)=>{
    const {keys, values, session} = res.locals;
    const userId = (session.user as IUser)._id;
    const otherUserId = getValue(keys, values, "userId");
    const chat = await Chat.findOne({
        members: { $all: [userId, otherUserId] },
    }).populate([
        { path: "members" },
    ]).exec() || {};    
    if(!chat){
        return res.status(404).send(handler.error(handler.STATUS_404))
    }
    return res.status(200).send(handler.success(chat))
})

export default app;
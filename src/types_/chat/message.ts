import { Time } from "../../types_";
import IMongoDocument from "../../types_/mongo";
import IUser from "../../types_/user";
import IChat from ".";

export default interface IMessage extends IMongoDocument {
    chat: IMongoDocument["_id"] | IChat
    sender: IMongoDocument["_id"] | IUser
    message: string
    createdAt: Time
}
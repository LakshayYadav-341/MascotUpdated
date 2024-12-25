import { Time } from "../../types_";
import IMongoDocument from "../mongo";
import IUser from "../user";

export default interface IChat extends IMongoDocument {
    name?: string
    members: (IMongoDocument["_id"]|IUser)[]
    isGroup: boolean
    createdAt: Time
}
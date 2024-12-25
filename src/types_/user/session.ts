import { Time } from "../../types_";
import IMongoDocument from "../../types_/mongo";
import { JwtPayload } from "jsonwebtoken";
import IUser from ".";

export interface Payload extends JwtPayload {
    user: string
    createdAt: Time
}

export default interface ISession extends IMongoDocument {
    user: IMongoDocument["_id"] | IUser
    token: string
    createdAt: Time
}
import { Time } from "../../types_";
import IMongoDocument from "../../types_/mongo";

export default interface INews extends IMongoDocument {
    title: string
    description?: string
    createdAt: Time
}
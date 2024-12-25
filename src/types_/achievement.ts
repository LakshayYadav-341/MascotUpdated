import { Time } from "../types_";
import IMongoDocument from "./mongo";

export default interface IAchievement extends IMongoDocument {
    info: string
    description?: string
    documents: string[]
    createdAt: Time
}
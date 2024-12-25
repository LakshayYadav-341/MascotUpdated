import IMongoDocument from "../../types_/mongo";
import ICompany from "./company";
import { Time } from "../../types_";

export default interface IWork extends IMongoDocument {
    company: IMongoDocument["_id"]|ICompany
    from: Time
    isCurrent: boolean
    to?: Time
    name: string
}
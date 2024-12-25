import { Time } from "../../types_";
import IInstitute from "../../types_/institute";
import IMongoDocument from "../../types_/mongo";
import IUser from "../../types_/user";


export default interface IPost extends IMongoDocument {
    user: IMongoDocument["_id"]|IUser
    content: {
        text: string
        media?: string[]
    }
    createdAt: Time
    institute?: IMongoDocument["_id"]|IInstitute
}
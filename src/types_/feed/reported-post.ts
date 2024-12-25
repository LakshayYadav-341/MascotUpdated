import IMongoDocument from "../../types_/mongo";
import IUser from "../../types_/user";
import IPost from "./post";

export default interface IReportedPost extends IMongoDocument{
    post : IMongoDocument["_id"]|IPost, 
    by: IMongoDocument["_id"]|IUser,
    reason: string
}
import IMongoDocument from "../../types_/mongo";
import IUser from ".";

export default interface IConnection extends IMongoDocument {
    reduce(arg0: (userIds: string[], connection: IConnection) => string[], arg1: undefined[]): unknown;
    users: (IMongoDocument["_id"]|IUser)[]
}
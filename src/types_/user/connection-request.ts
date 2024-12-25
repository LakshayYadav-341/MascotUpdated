import IMongoDocument from "../../types_/mongo";
import IUser from ".";
import { Time } from "../../types_";
import IInstitute from "../../types_/institute";

export enum ConnectionTypes {
    mutual = "Mutual",
    alumniRequest = "AlumniRequest"
}

export default interface IConnectionRequest extends IMongoDocument {
    from: IMongoDocument["_id"] | IUser
    to: IMongoDocument["_id"] | IUser
    type: ConnectionTypes | string
    createdAt: Time
    document?: string
    institute?: IMongoDocument["_id"] | IInstitute
}
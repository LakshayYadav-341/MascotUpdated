import { Time } from "../../types_";
import IMongoDocument from "../../types_/mongo";
import { Schema } from "mongoose";
import IUser from ".";
import IInstitute from "../../types_/institute";

export default interface IAdmin extends IMongoDocument {
    role: "system"|"institute"
    createdAt: Time
    createdBy?: Schema.Types.ObjectId|IUser
    institute?: Schema.Types.ObjectId|IInstitute
}
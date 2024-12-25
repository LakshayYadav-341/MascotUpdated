import { Time } from "../../types_";
import IMongoDocument from "../../types_/mongo";
import IUser from "../../types_/user";
import IJob from ".";

// application for the job posted
export default interface IJobApplication extends IMongoDocument {
    user: IMongoDocument["_id"]|IUser // make sure the role of the user profile has to student
    coverLetter: string
    resume: string
    createdAt: Time
    job: IMongoDocument["_id"]|IJob
}
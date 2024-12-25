import { Time } from "../../types_";
import IMongoDocument from "../../types_/mongo";
import ISkill from "../../types_/skill";
import IUser from "../../types_/user";
import ICompany from "./company";

// job referral to be posted
export default interface IJob extends IMongoDocument {
    from: IMongoDocument["_id"]|IUser
    title: string
    skills: (IMongoDocument["_id"]|ISkill)[]
    description: string
    createdAt: Time
    isCompleted?: boolean
    endsAt?: Time // The application open time -- need not be set at the time of creation
    company: (IMongoDocument["_id"]|ICompany)
    experienceYears: number
}
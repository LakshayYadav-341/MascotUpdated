import IMongoDocument from "../../types_/mongo";
import IInstitute from ".";
import { Time } from "../../types_";
import IAchievement from "../../types_/achievement";

export default interface IFaculty extends IMongoDocument {
    name: string
    contact: {
        emails: string[]
        phone: string[]
        social: {
            facebook?: string
            instagram?: string
            x?: string
            quora?: string
            others?: [string, string][]
        }
    }
    previousWorks: {
        institute: IMongoDocument["_id"]|IInstitute
        from: Time
        to: Time
    }[]
    isPartTime: boolean
    joinedDate: Time
    achievements: (IMongoDocument["_id"]|IAchievement)[]
}
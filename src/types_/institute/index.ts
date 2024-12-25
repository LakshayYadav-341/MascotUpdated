import IAddress from "../../types_/address"
import IMongoDocument from "../../types_/mongo"
import IUser from "../../types_/user"
import ICourse from "./course"
import IAchievement from "../../types_/achievement"


export default interface IInstitute extends IMongoDocument {
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
    admin: IMongoDocument["_id"]|IUser
    address: IMongoDocument["_id"]|IAddress
    faculty: (IMongoDocument["_id"]|IUser)[]
    courses: (IMongoDocument["_id"]|ICourse)[]
    awards: (IMongoDocument["_id"]|IAchievement)[]
}
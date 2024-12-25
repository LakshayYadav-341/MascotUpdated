import { Time } from "../../types_";
import IFaculty from "../../types_/institute/faculty";
import IMongoDocument from "../../types_/mongo";
import IAdmin from "./admin";
import IProfile from "./profile";

export enum ProfileRoles {
    student = "student",
    alumni = "alumni",
    admin = "admin",
    faculty = "faculty"
}

export default interface IUser extends IMongoDocument {
    name: {
        first: string
        last: string
    }
    dob: Time

    email: string
    phone: string
    password: string

    bio?: string
    profilePhoto?: string
    role: ProfileRoles | string

    profile?: IMongoDocument["_id"] | IProfile
    admin?: IMongoDocument["_id"] | IAdmin
    faculty?: IMongoDocument["_id"] | IFaculty
}
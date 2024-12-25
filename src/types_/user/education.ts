import IMongoDocument from "../../types_/mongo";
import IInstitute from "../institute";
import { Time } from "../../types_";

export enum EducationTypes {
    metric = "metric",
    highSchool = "high school",
    graduation = "graduation",
    postGraduation = "post graduation",
    phd = "Ph.D"
}

export default interface IEducation extends IMongoDocument {
    institute: IMongoDocument["_id"]|IInstitute
    type: EducationTypes|string
    joined: Time
    completion: {
        isCurrent: boolean
        completed?: Time
    }
    remarks?: string
}
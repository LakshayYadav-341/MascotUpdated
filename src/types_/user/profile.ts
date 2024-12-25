import IAchievement from "../../types_/achievement";
import IMongoDocument from "../../types_/mongo";
import ISkill from "../../types_/skill";
import IEducation from "./education";
import IAddress from "../../types_/address";
import IWork from "../../types_/job/work";

export default interface IProfile extends IMongoDocument {
    education: (IMongoDocument["_id"]|IEducation)[]
    achievements: (IMongoDocument["_id"]|IAchievement)[]
    skills: (IMongoDocument["_id"]|ISkill)[]
    address: IMongoDocument["_id"]|IAddress
    workExperience: (IMongoDocument["_id"]|IWork)[]
}
import IMongoDocument from "../../types_/mongo";

export default interface ICourse extends IMongoDocument {
    name: string
    batch: string
    programs: {
        name: string
        curriculum: string[]
    }[]
    specialization: {
        name: string
        curriculum: string[]
    }
}
import IMongoDocument from "../../types_/mongo";

export default interface ICompany extends IMongoDocument {
    name: string
    description?: string
}
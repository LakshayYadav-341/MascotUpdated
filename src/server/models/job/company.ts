import CompanyHandler from "../../../handlers/job/company";
import ICompany from "../../../types_/job/company";
import { Models } from "../../../utils/models";
import { model, Schema } from "mongoose";

const handler = new CompanyHandler()

const companySchema = new Schema<ICompany>({
    name: {
        type: String,
        required: handler.fieldRequired("name")
    },
    description: String
})

const Company = model(Models.company, companySchema)
export default Company
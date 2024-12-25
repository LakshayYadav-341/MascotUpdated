import { ErrorHandler } from "../../handlers/error";
import ICompany from "../../types_/job/company";
import { Models } from "../../utils/models";

export default class CompanyHandler extends ErrorHandler<ICompany> {
    constructor() {
        super(Models.company)
    }
}
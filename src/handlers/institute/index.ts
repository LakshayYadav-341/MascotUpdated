import { ErrorHandler } from "../../handlers/error";
import IInstitute from "../../types_/institute";
import { Models } from "../../utils/models";
import Validator from "../../types_/validator";

export default class InstituteHandler extends ErrorHandler<IInstitute> {

    emailsArrayMessage: string
    phoneArrayMessage: string
    constructor() {
        super(Models.institute)
        
        this.phoneArrayMessage = ""
        this.emailsArrayMessage = ""
    }
    
    emptyArray = (field: string) => `The ${field} cannot empty array`
    invalidArrayIndex = (field: string, index: number) => `Ths ${field} at index ${index} is invalid`
    
    isEmailArray = async (emails: string[]) => {
        if(!emails.length) {
            this.emailsArrayMessage = this.emptyArray("emails")
            return await Promise.reject<boolean>(this.emailsArrayMessage)
        }
        const duplicates = [] as string[]
        for(let i=0; i<emails.length; i++) {
            if(duplicates.includes(emails[i])) {
                continue
            }
            if(!Validator.email(emails[i])) {
                this.emailsArrayMessage = this.invalidArrayIndex("email", i)
                return await Promise.reject<boolean>(this.emailsArrayMessage)
            }
            duplicates.push(emails[i])
        }
        return await Promise.resolve<boolean>(true)
    }

    isPhoneArray = async (phones: string[]) => {
        if(!phones.length) {
            this.phoneArrayMessage = this.emptyArray("phones")
            return await Promise.reject<boolean>(this.phoneArrayMessage)
        }
        const duplicates = [] as string[]
        for(let i=0; i<phones.length; i++) {
            if(duplicates.includes(phones[i])) {
                continue
            }
            if(!Validator.phone(phones[i])) {
                this.phoneArrayMessage = this.invalidArrayIndex("phone", i)
                return await Promise.reject<boolean>(this.phoneArrayMessage)
            }
            duplicates.push(phones[i])
        }
        return await Promise.resolve<boolean>(true)
    }
}
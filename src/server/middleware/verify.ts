import { ErrorHandler } from "../../handlers/error"
import { JWT_SECRET } from "../../server/config"
import Session from "../../server/models/user/session"
import IUser from "../../types_/user"
import { Payload } from "../../types_/user/session"
import { getKeys, getValue, getValues } from "../../utils/object"
import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

export const verifyBody = (
    required: string[], 
    handler: ErrorHandler<any> = new ErrorHandler<any>("request")
) => (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    
    const body = req.body
    const keys = getKeys(body)
    const values = getValues(body)
    for (const req of required) {
        if (!keys.includes(req)) {
            return res.status(422).send(handler.error(handler.fieldRequired(req)))
        }
        else if(getValue(keys, values, req) instanceof String) {
            if(!(getValue(keys, values, req) as string).length) {
                return res.status(422).send(handler.error(handler.fieldRequired(req)))
            }
        }
    }
    res.locals.keys = keys
    res.locals.values = values
    next()
}

export const verifyToken = (
    handler: ErrorHandler<any> = new ErrorHandler<any>("request")
) => async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = (req.headers.authorization! as string || "").split(" ")
    if(!authHeader.length) {
        return res.status(422).send(handler.error(handler.MISSING_AUTH_HEADER))
    }
    if(authHeader.length > 3 || !authHeader[0].startsWith("Bearer")) {
        return res.status(422).send(handler.error("Invalid Authorization Header! Please make that authorization type is bearer"))
    }
    const session = await Session.findOne({token: authHeader[1]}).populate({
        path: "user",
        populate: {
            path: "admin"
        }
    })
    if(!session) {
        return res.status(422).send(handler.error("Session not found! Please try to login again."))
    }
    try {
        const decoded = jwt.verify(authHeader[1], JWT_SECRET) as Payload
        if(decoded.user === (session.user as IUser)._id.toString()) {
            res.locals.session = session
            next()
        }
        else {
            return res.status(422).send(handler.error("Invalid user session! Please try to login again."))
        }
    }
    catch(err) {
        if(err) {
            return res.status(401).send(handler.error("Session timed out! Please try to login again."))
        }
        else {
            return res.status(422).send(handler.error("Session not found! Please try to login again."))
        }
    }
}

export const verifyParams = (
    required: string[],
    handler: ErrorHandler<any> = new ErrorHandler<any>("request")
) => (req: Request, res: Response, next: NextFunction) => {
    const body = req.params
    const keys = getKeys(body)
    const values = getValues(body)
    for (const req of required) {
        if (!keys.includes(req)) {
            return res.status(422).send(handler.error(handler.fieldRequired(req)))
        }
        else if(getValue(keys, values, req) instanceof String) {
            if(!(getValue(keys, values, req) as string).length) {
                return res.status(422).send(handler.error(handler.fieldRequired(req)))
            }
        }
    }
    res.locals.keys = keys
    res.locals.values = values
    next()
}

export const verifyAdmin = (
    handler: ErrorHandler<any> = new ErrorHandler<any>("request")
) => async (_: Request, res: Response, next: NextFunction) => {
    const { session } = res.locals;
    const user = session.user as IUser
    if(!user.admin) {
        return res.status(403).send(handler.error("User is not admin!"))
    }
    next()
}
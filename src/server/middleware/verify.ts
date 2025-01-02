import { ErrorHandler } from "../../handlers/error";
import { JWT_SECRET } from "../../server/config";
import Session from "../../server/models/user/session";
import IUser from "../../types_/user";
import { Payload } from "../../types_/user/session";
import { getKeys, getValue, getValues } from "../../utils/object";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const verifyBody = (
    required: string[], 
    handler: ErrorHandler<any> = new ErrorHandler<any>("request")
) => (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const keys = getKeys(body);
    const values = getValues(body);
    
    // Check if all required fields are present
    for (const req of required) {
        if (!keys.includes(req)) {
            return res.status(422).send(handler.error(handler.fieldRequired(req)));
        }
        // Check if required field is a non-empty string
        else if (getValue(keys, values, req) instanceof String) {
            if (!(getValue(keys, values, req) as string).length) {
                return res.status(422).send(handler.error(handler.fieldRequired(req)));
            }
        }
    }
    
    res.locals.keys = keys;
    res.locals.values = values;
    next();
}

export const verifyToken = (
    handler: ErrorHandler<any> = new ErrorHandler<any>("request")
) => async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = (req.headers.authorization! as string || "").split(" ");
    
    if (!authHeader.length) {
        return res.status(422).send(handler.error(handler.MISSING_AUTH_HEADER));
    }
    
    if (authHeader.length > 2 || !authHeader[0].startsWith("Bearer")) {
        return res.status(422).send(handler.error("Invalid Authorization Header! Please use 'Bearer' type authorization."));
    }
    
    try {
        const session = await Session.findOne({ token: authHeader[1] }).populate({
            path: "user",
            populate: { path: "admin" }
        });

        if (!session) {
            return res.status(422).send(handler.error("Session not found! Please log in again."));
        }

        const decoded = jwt.verify(authHeader[1], JWT_SECRET) as Payload;
        
        if (decoded.user === (session.user as IUser)._id.toString()) {
            res.locals.session = session;
            next();
        } else {
            return res.status(422).send(handler.error("Invalid user session! Please log in again."));
        }
    } catch (err) {
        console.error("JWT verification error:", err);
        return res.status(401).send(handler.error("Session timed out or is invalid! Please log in again."));
    }
}

export const verifyParams = (
    required: string[], 
    handler: ErrorHandler<any> = new ErrorHandler<any>("request")
) => (req: Request, res: Response, next: NextFunction) => {
    const body = req.params;
    const keys = getKeys(body);
    const values = getValues(body);
    
    // Check if all required params are present
    for (const req of required) {
        if (!keys.includes(req)) {
            return res.status(422).send(handler.error(handler.fieldRequired(req)));
        }
        // Check if the param is a non-empty string
        else if (getValue(keys, values, req) instanceof String) {
            if (!(getValue(keys, values, req) as string).length) {
                return res.status(422).send(handler.error(handler.fieldRequired(req)));
            }
        }
    }
    
    res.locals.keys = keys;
    res.locals.values = values;
    next();
}

export const verifyAdmin = (
    handler: ErrorHandler<any> = new ErrorHandler<any>("request")
) => async (_: Request, res: Response, next: NextFunction) => {
    const { session } = res.locals;
    const user = session.user as IUser;
    
    // Check if user has admin privileges
    if (!user.admin) {
        return res.status(403).send(handler.error("Forbidden: User is not an admin!"));
    }

    next();
}

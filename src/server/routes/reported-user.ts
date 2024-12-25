import ReportedUserHandler from "../../handlers/user/reported-user";
import { verifyBody, verifyToken, verifyParams, verifyAdmin } from "../../server/middleware/verify";
import ReportedUser from "../../server/models/user/reported-user";
import IUser from "../../types_/user";
import { Router } from "express";
import { getValue } from "../../utils/object";

const app = Router();

const handler = new ReportedUserHandler();

const required = ["user", "reason"]
app.post("/create", verifyToken(), verifyBody(required), async(_, res)=>{
    const {keys, values, session} = res.locals; 
    const user = (session.user as IUser)._id.toString();
    const reportedUserId = getValue(keys, values, "user");
    const reason = getValue(keys, values, "reason");

    let reportedUser = await ReportedUser.findOne({user: reportedUserId})
    if (reportedUser) {
        reportedUser.by.push({user, reason});
        await reportedUser.save();
    }
    else{
        reportedUser = await ReportedUser.create({
            user: reportedUserId,
            by: [{user, reason}],
        });
    }
    if(!reportedUser){
        return res.status(404).send(handler.error(handler.STATUS_404))
    }
    return res.status(200).send(handler.success(reportedUser))
})

app.get("/", verifyToken(), verifyAdmin(), async(_, res)=>{
    const reportedUsers = await ReportedUser.find().populate([
        { path: "user" },
        { path: "by.user" },
    ]).exec() || [];
    if (!reportedUsers) {
        return res.status(404).send(handler.error(handler.STATUS_404))
    }
    return res.status(200).send(handler.success(reportedUsers))
})

app.get("/:id", verifyToken(), verifyParams(["id"]), async(_,res)=>{
    const {keys, values, session} = res.locals; 
    const user = (session.user as IUser)._id;
    const reportedUserId = getValue(keys, values, "id");

    const reportedUser = await ReportedUser.findOne({user: reportedUserId, "by.user": user}) || []
    if(!reportedUser){
        return res.status(404).send(handler.error(handler.STATUS_404))
    }
    return res.status(200).send(handler.success(reportedUser))
})

app.delete("/delete/:id", verifyToken(), verifyAdmin(), verifyParams(["id"]), async(_, res)=>{
    const {keys, values} = res.locals; 
    const reportedUserId = getValue(keys, values, "id");

    const deletedUser = await ReportedUser.findOneAndDelete({user: reportedUserId});
    if(!deletedUser){
        return res.status(404).send(handler.error(handler.STATUS_404))
    }
    return res.status(200).send(handler.success(deletedUser))
})

export default app;
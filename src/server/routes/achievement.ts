import AchievementHandler from "../../handlers/achievement";
import { verifyBody, verifyToken } from "../../server/middleware/verify";
import Achievement from "../../server/models/achievement";
import Profile from "../../server/models/user/profile";
import IUser from "../../types_/user";
import { downloadFile } from "../../utils/file";
import Hash from "../../utils/hash";
import { getValue } from "../../utils/object";
import { Router } from "express";
import Multer from "multer";

const app = Router();
const multer = Multer()
const handler = new AchievementHandler();

app.post("/create", verifyToken(), multer.array("documents"), verifyBody(["info"]), async (req, res) => {
    const { keys, values, session } = res.locals;
    const user = (session.user as IUser)._id.toString()
    if(!session.user.profile) {
        return res.status(404).send(handler.error("Profile not found! Please create your profile first"))
    }
    const profile = await Profile.findById(session.user?.profile)
    if(!profile) {
        return res.status(404).send(handler.error("Profile not found! Please create your profile first"))
    }
    const files = req.files as Express.Multer.File[]
    const fileUrls: string[] = []
    for(const file of files) {
        const originalName = file.originalname.split(".")
        const mimeType = originalName.pop()
        const fileName = Hash.create(user+"--"+originalName.join(".")).replace(/\//g, "--")
        const url = await downloadFile(`${fileName}.${mimeType}`, user, file.buffer)
        if(url && url.length) {
            fileUrls.push(url)
        }
    }
    const achievement = await Achievement.create({
        info: getValue(keys, values, "info"),
        ...(keys.includes("description") && {
            description: getValue(keys, values, "description")
        }),
        documents: fileUrls
    })
    if(!achievement)
        return res.status(404).json(handler.error(handler.STATUS_404));
    profile.set("achievements", [...profile.achievements, achievement])
    const updatedProfile = await profile.save()
    if(!updatedProfile) {
        return res.status(404).json(handler.error(handler.STATUS_404));
    }
    return res.status(200).json(handler.success(updatedProfile));
});

export default app
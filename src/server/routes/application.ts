import JobApplicationHandler from "../../handlers/job/application";
import { verifyBody, verifyToken } from "../../server/middleware/verify";
import JobApplication from "../../server/models/job/application";
import IUser from "../../types_/user";
import { downloadFile } from "../../utils/file";
import Hash from "../../utils/hash";
import { getValue } from "../../utils/object";
import { Router } from "express";
import Multer from "multer"

const app = Router();
const handler = new JobApplicationHandler();
const multer = Multer({
    fileFilter: (_, file, cb) => {
        if (file.originalname.split(".").pop() !== "pdf") {
            return cb(new Error("The input file is not a pdf document"))
        }
        return cb(null, true)
    }
})

app.post("/create",
    verifyToken(),
    multer.single("resume"),
    verifyBody(["coverLetter", "job"]),
    async (req, res) => {
        const { keys, values, session } = res.locals;
        const file = req.file
        const user = (session.user as IUser)._id.toString()
        if(!file) {
            return res.status(422).send(handler.error(handler.fieldInvalid("resume", "Alumni Request requires a document to upload type pdf.")))
        }
        const originalName = file!.originalname.split(".")
        const mimeType = originalName.pop()
        const fileName = Hash.create(user + "--" + originalName.join(".")).replace(/\//g, "--")
        const url = await downloadFile(`${fileName}.${mimeType}`, user, file!.buffer) as string
        if(!url) {
            return res.status(422).send(handler.error("Error downloading file. Please upload the correct file"))
        }
        const jobApplication = await JobApplication.create({
            user: (session.user as IUser)._id,
            coverLetter: getValue(keys, values, "coverLetter"),
            resume: url,
            job: getValue(keys, values, "job")
        });
        if(!jobApplication)
            return res.status(404).json(handler.error(handler.STATUS_404));
        return res.status(200).json(handler.success(jobApplication));
    }
);

export default app;

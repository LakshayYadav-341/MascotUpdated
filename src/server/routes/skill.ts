import SkillHandler from "../../handlers/skill";
import { verifyBody, verifyParams, verifyToken } from "../../server/middleware/verify";
import Skill from "../../server/models/skill";
import { getValue } from "../../utils/object";
import { Router } from "express";

const app = Router();
const handler = new SkillHandler();

const required = ["name"];

app.post("/create", verifyToken(), verifyBody(required), async (_, res) => {
    const { keys, values } = res.locals;
    const skill = await Skill.create({
        name: getValue(keys, values, "name"),
    });
    if (!skill) {
        return res.status(404).send(handler.error(handler.STATUS_404));
    }
    return res.status(200).send(handler.success(skill));
});

app.delete("/:id", verifyToken(), verifyParams(["id"]), async (_, res) => {
    const { keys, values } = res.locals;
    const skill = await Skill.findByIdAndDelete(getValue(keys, values, "id"));
    if (!skill) {
        return res.status(404).send(handler.error(handler.STATUS_404));
    }
    return res.status(200).send(handler.success(skill));
});

export default app
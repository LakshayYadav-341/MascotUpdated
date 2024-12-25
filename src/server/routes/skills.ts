import SkillHandler from "../../handlers/skill";
import Skill from "../../server/models/skill";
import { Router } from "express";

const app = Router();
const handler = new SkillHandler();

app.get("/", async (_, res) => {
    const skills = await Skill.find();
    return res.status(200).send(handler.success(skills));
});

export default app;

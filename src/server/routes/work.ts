import WorkHandler from "../../handlers/job/work";
import { verifyBody, verifyParams, verifyToken } from "../../server/middleware/verify";
import Work from "../../server/models/job/work";
import { getValue } from "../../utils/object";
import { Router } from "express";

const app = Router();
const handler = new WorkHandler();

const required = ["company", "from", "isCurrent", "name"];

// Create Work
app.post("/create", verifyToken(), verifyBody(required), async (_, res) => {
    const { keys, values } = res.locals;
    const work = await Work.create({
        company: getValue(keys, values, "company"),
        from: getValue(keys, values, "from"),
        isCurrent: getValue(keys, values, "isCurrent"),
        to: getValue(keys, values, "to"),
        name: getValue(keys, values, "name")
    });
    if (!work) {
        return res.status(404).send(handler.error(handler.STATUS_404));
    }
    return res.status(200).send(handler.success(work));
});

// Retrieve All Works
app.get("/", async (_, res) => {
    const works = await Work.find();
    return res.status(200).send(handler.success(works));
});

// Update Work by ID
app.put("/:id", verifyToken(), verifyBody(required), async (req, res) => {
    if(!Object.keys(req.params).includes("id") || !req.params.id.length) {
        return res.status(422).send(handler.error(handler.fieldRequired("id")))
    }
    const workId = req.params.id;
    const { keys, values } = res.locals;
    const work = await Work.findByIdAndUpdate(workId, {
        company: getValue(keys, values, "company"),
        from: getValue(keys, values, "from"),
        isCurrent: getValue(keys, values, "isCurrent"),
        to: getValue(keys, values, "to"),
        name: getValue(keys, values, "name")
    }, { new: true });
    if (!work) {
        return res.status(404).send(handler.error(handler.STATUS_404));
    }
    return res.status(200).send(handler.success(work));
});

// Delete Work by ID
app.delete("/:id", verifyToken(), verifyParams(["id"]), async (_, res) => {
    const { keys, values } = res.locals;
    const work = await Work.findByIdAndDelete(getValue(keys, values, "id"));
    if (!work) {
        return res.status(404).send(handler.error(handler.STATUS_404));
    }
    return res.status(200).send(handler.success(work));
});



export default app;

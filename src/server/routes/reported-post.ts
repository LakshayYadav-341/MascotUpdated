import { verifyBody, verifyToken, verifyParams, verifyAdmin } from "../../server/middleware/verify";
import ReportedPost from "../../server/models/feed/reported-post";
import IUser from "../../types_/user";
import { Router } from "express";
import { getValue } from "../../utils/object";
import ReportedPostHandler from "../../handlers/feed/reported-post";

const app = Router();
const handler = new ReportedPostHandler();

const requiredFields = ["post", "reason"];

app.post("/create", verifyToken(), verifyBody(requiredFields), async (_, res) => {
    try {
        const { keys, values, session } = res.locals;
        const user = (session.user as IUser)._id.toString();

        const reportedPost = await ReportedPost.create({
            post: getValue(keys, values, "post"),
            by: user,
            reason: getValue(keys, values, "reason"),
        });

        if (!reportedPost) {
            return res.status(404).send(handler.error(handler.STATUS_404));
        }

        return res.status(200).send(handler.success(reportedPost));
    } catch (error) {
        console.error("Error creating reported post:", error);
        return res.status(500).send(handler.error(handler.STATUS_404));
    }
});

app.get("/", verifyToken(), verifyAdmin(), async (_, res) => {
    try {
        const reportedPosts = await ReportedPost.find().populate([
            { path: "post" },
            { path: "by" },
        ]).exec() || [];

        if (!reportedPosts) {
            return res.status(404).send(handler.error(handler.STATUS_404));
        }

        return res.status(200).send(handler.success(reportedPosts));
    } catch (error) {
        console.error("Error fetching reported posts:", error);
        return res.status(500).send(handler.error(handler.STATUS_404));
    }
});

app.get("/:id", verifyToken(), verifyParams(["id"]), async (_, res) => {
    try {
        const { keys, values, session } = res.locals;
        const user = (session.user as IUser)._id;
        const reportedPostId = getValue(keys, values, "id");

        const reportedPost = await ReportedPost.findOne({
            _id: reportedPostId,
            by: user,
        }).populate([{ path: "post" }, { path: "by" }]);

        if (!reportedPost) {
            return res.status(404).send(handler.error(handler.STATUS_404));
        }

        return res.status(200).send(handler.success(reportedPost));
    } catch (error) {
        console.error("Error fetching reported post:", error);
        return res.status(500).send(handler.error(handler.STATUS_404));
    }
});

app.get("/getPost/:post", verifyToken(), verifyParams(["post"]), async (_, res) => {
    try {
        const { keys, values } = res.locals;
        const reportedPostId = getValue(keys, values, "post");

        const reportedPosts = await ReportedPost.find({
            post: reportedPostId
        }).populate([{ path: "post" }, { path: "by" }]);

        if (!reportedPosts || reportedPosts.length === 0) {
            return res.status(405).send(handler.error(handler.STATUS_404));
        }

        const formattedReportedPosts = reportedPosts.map((reportedPost) => ({
            _id: reportedPost._id,
            post: reportedPost.post,
            by: reportedPost.by,
            reason: reportedPost.reason
        }));

        return res.status(200).send(handler.success(formattedReportedPosts));
    } catch (error) {
        console.error("Error fetching reported posts:", error);
        return res.status(500).send(handler.error(handler.STATUS_404));
    }
});

app.delete("/delete/:id", verifyToken(), verifyAdmin(), verifyParams(["id"]), async (_, res) => {
    try {
        const { keys, values } = res.locals;
        const reportedPostId = getValue(keys, values, "id");

        const deletedPost = await ReportedPost.deleteMany({ post: reportedPostId });

        if (!deletedPost) {
            return res.status(404).send(handler.error(handler.STATUS_404));
        }

        return res.status(200).send(handler.success(deletedPost));
    } catch (error) {
        console.error("Error deleting reported post:", error);
        return res.status(500).send(handler.error(handler.STATUS_404));
    }
});

export default app;

import PostHandler from "../../handlers/feed/post";
import { verifyBody, verifyParams, verifyToken } from "../../server/middleware/verify";
import Interaction from "../../server/models/feed/interaction";
import Post from "../../server/models/feed/post";
import { InteractionType } from "../../types_/feed/interaction";
import IUser from "../../types_/user";
import { downloadFile } from "../../utils/file";
import Hash from "../../utils/hash";
import { getKeys, getValue, getValues } from "../../utils/object";
import { Router } from "express";
import Multer from "multer";

const app = Router()
const multer = Multer()
const handler = new PostHandler()

const required = ["content.text"]
app.post("/create", verifyToken(), multer.array("content.media"), verifyBody(required), async (req, res) => {
    const { keys, values, session } = res.locals;
    const user = (session.user as IUser)._id.toString();
    const files = req.files as Express.Multer.File[];
    const fileUrls: string[] = [];

    // Process uploaded files
    for (const file of files) {
        const originalName = file.originalname.split(".");
        const mimeType = originalName.pop();
        const fileName = Hash.create(user + "--" + originalName.join(".")).replace(/\//g, "--");
        const url = await downloadFile(`${fileName}.${mimeType}`, user, file.buffer);
        if (url && url.length) {
            fileUrls.push(url);
        }
    }

    // Create the post
    const post = await Post.create({
        user,
        content: {
            text: getValue(keys, values, "content.text"),
            media: fileUrls
        }
    });

    // If post creation failed
    if (!post) {
        return res.status(404).send(handler.error(handler.STATUS_404));
    }

    // Send success response with the created post
    res.status(200).send(handler.success(post));
});


app.put("/:post/interact/:type", verifyToken(), verifyParams(["post", "type"]), async (req, res) => {
    const { keys, values, session } = res.locals
    if (!Object.values(InteractionType).includes(getValue(keys, values, "type"))) {
        return res.status(422).send(handler.error("Invalid interaction type."))
    }
    const body = req.body
    const bodyKeys = getKeys(body)
    const bodyValues = getValues(body)
    const alreadyLiked = await Interaction.findOne({
        user: (session.user as IUser)._id,
        post: getValue(keys, values, "post"),
        type: getValue(keys, values, "type")
    })
    if (getValue(keys, values, "type") === InteractionType.like && alreadyLiked) {
        const deleted = await Interaction.findByIdAndDelete(alreadyLiked._id)
        if (!deleted) {
            return res.status(404).send(handler.error(handler.STATUS_404))
        }
        return res.status(200).send(handler.success(deleted))
    }
    if (
        getValue(keys, values, "type") === InteractionType.comment &&
        (!bodyKeys.includes("comment") ||
            !getValue(bodyKeys, bodyValues, "comment") ||
            !(getValue(bodyKeys, bodyValues, "comment") as string).length)
    ) {
        return res.status(422).send(handler.error(handler.fieldRequired("comment")))
    }
    const interaction = await Interaction.create({
        post: getValue(keys, values, "post"),
        user: (session.user as IUser)._id,
        type: getValue(keys, values, "type"),
        ...(getValue(keys, values, "type") === InteractionType.comment && {
            comment: getValue(bodyKeys, bodyValues, "comment")
        })
    })
    if (!interaction) {
        return res.status(404).send(handler.error(handler.STATUS_404))
    }
    res.status(200).send(handler.success(interaction))
})

app.get("/:post/interactions/:type", verifyToken(), verifyParams(["post"]), async (_, res) => {
    const { keys, values } = res.locals
    const interactions = await Interaction.find({
        post: getValue(keys, values, "post"),
        ...(keys.includes("type") && Object.values(InteractionType).includes(getValue(keys, values, "type")) && {
            type: getValue(keys, values, "type")
        })
    }).populate({ path: "user", select: "-password" }).exec()
    return res.status(200).send(interactions || [])
})

app.delete("/:id", verifyToken(), verifyParams(["id"]), async (req, res) => {
    const postId = req.params.id;

    // Delete interactions associated with the post
    await Interaction.deleteMany({ post: postId });

    // Delete the post
    const post = await Post.findByIdAndDelete(postId);

    // If post doesn't exist
    if (!post) {
        return res.status(404).send(handler.error(handler.STATUS_404));
    }
    // Send success response with the deleted post
    return res.status(200).send(handler.success(post));
});

export default app
import { ErrorHandler } from "../../handlers/error";
import IPost from "../../types_/feed/post";
import { Models } from "../../utils/models";

export default class PostHandler extends ErrorHandler<IPost> {
    constructor() {
        super(Models.post)
    }
}
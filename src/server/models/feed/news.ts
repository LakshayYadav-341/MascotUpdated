import NewsHandler from "../../../handlers/feed/news";
import INews from "../../../types_/feed/news";
import { Models } from "../../../utils/models";
import { model, Schema } from "mongoose";

const handler = new NewsHandler()

const newsSchema = new Schema<INews>({
    title: {
        type: String,
        required: handler.fieldRequired("title")
    },
    description: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const News = model(Models.news, newsSchema)
export default News
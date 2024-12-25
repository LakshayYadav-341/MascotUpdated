import { ErrorHandler } from "../../handlers/error";
import INews from "../../types_/feed/news";
import { Models } from "../../utils/models";

export default class NewsHandler extends ErrorHandler<INews> {
    constructor() {
        super(Models.news)
    }
}
import { Context, Telegraf } from "telegraf";
import { getUnsubscribedChannels } from "../utils/utils";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";

export default class Bot {
    bot: Telegraf;

    constructor(tg_token: string) {
        this.bot = new Telegraf(tg_token);
        if (!this.bot) {
            throw new Error("Initialization failed. Check TG_TOKEN");
        }
    }

    runBot = async () => {
        await this.bot.launch();
        process.once("SIGINT", () => this.bot.stop("SIGINT"));
        process.once("SIGTERM", () => this.bot.stop("SIGTERM"));
    };
}

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

    startCommand = async (ctx: Context) => {
        const userId = ctx.from?.id;
        if (userId) {
            const unsubscribedChannels = await getUnsubscribedChannels(
                this,
                userId
            );

            if (unsubscribedChannels.length) {
                let inlineKeyboard: InlineKeyboardButton[][] = [];
                unsubscribedChannels.forEach((value, index, array) => {
                    const channelLinkButton: InlineKeyboardButton = {
                        url: `https://t.me/${value}`,
                        text: value,
                    };
                    inlineKeyboard.push([channelLinkButton]);
                });

                ctx.reply(
                    "Упс, ты подписан не на все каналы. Подпишись на них, чтобы получить доступ к фильмам.",
                    {
                        reply_markup: {
                            inline_keyboard: inlineKeyboard,
                        },
                    }
                );
            }
        }
    };
}

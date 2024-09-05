import { Context, Telegraf } from "telegraf";
import { getUnsubscribedChannels } from "../utils/utils";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { searchMovie } from "../utils/API/movies";

export default class Bot {
    bot: Telegraf;

    constructor(tg_token: string) {
        this.bot = new Telegraf(tg_token);
        if (!this.bot) {
            throw new Error("Initialization failed. Check TG_TOKEN");
        }
    }

    runBot = () => {
        this.bot.launch();

        this.bot.command("add", this.addMovieCommand);

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

    addMovieCommand = async (ctx: Context) => {
        
        console.log(ctx.text, ctx.from);
        const query = ctx.text?.slice(5);
        if (!query) {
            ctx.reply("Укажите название фильма!");
            return;
        }

        const movie = await searchMovie(query);

        // Film adding 

        ctx.replyWithPhoto(movie.poster, {
            caption: "Фильм \"" + movie.name + "\" был успешно добавлен.\n\nЕго id: " + movie.internalId
        })
    }
}

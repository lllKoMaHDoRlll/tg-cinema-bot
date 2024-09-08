import { Context, Telegraf } from "telegraf";
import { getUnsubscribedChannels } from "../utils/utils";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { searchMovie } from "../utils/API/movies";
import filmRepository from "../db/repositories/film.repository";
import Film from "../db/models/film.model";
import adminRepository from "../db/repositories/admin.repository";
import channelRepository from "../db/repositories/channel.repository";
import Channel from "../db/models/channel.model";

export default class Bot {
    bot: Telegraf;
    filmRepository;
    adminRepository;
    channelRepository;

    constructor(tg_token: string) {
        this.bot = new Telegraf(tg_token);
        if (!this.bot) {
            throw new Error("Initialization failed. Check TG_TOKEN");
        }
        
        this.filmRepository = filmRepository;
        this.adminRepository = adminRepository;
        this.channelRepository = channelRepository;
    }

    runBot = () => {
        this.bot.launch();

        this.bot.start(this.startCommand);

        this.bot.command("add", this.addMovieCommand);
        this.bot.command("get", this.getMovieCommand);

        this.bot.help(this.helpCommand);

        process.once("SIGINT", () => this.bot.stop("SIGINT"));
        process.once("SIGTERM", () => this.bot.stop("SIGTERM"));
    };

    startCommand = async (ctx: Context) => {
        const userId = ctx.from?.id;
        if (!userId) return;

        const unsubscribedChannels = await getUnsubscribedChannels(this, userId);

        if (unsubscribedChannels.length) {
            this.askToSubscribe(ctx, unsubscribedChannels);
        }
        else {
            ctx.reply("Поздравляю, ты подписан на все каналы!");
        }
    };

    addMovieCommand = async (ctx: Context) => {
        if (ctx.from?.is_bot) return;

        const userId = ctx.from?.id;
        if (!userId) return;
        const isAdmin = await this.adminRepository.getById(userId);

        if (!isAdmin) {
            console.log(userId + ": " + ctx.from.first_name);
            ctx.reply("Вы не админ!");
            return;
        }

        const query = ctx.text?.slice(5);
        if (!query) {
            ctx.reply("Укажите название фильма!");
            return;
        }

        const movie = await searchMovie(query);

        await this.filmRepository.create(movie);

        ctx.replyWithPhoto(movie.poster, {
            caption: "Фильм \"" + movie.name + "\" был успешно добавлен.\n\nЕго id: " + movie.internal_id
        })
    }

    getMovieCommand = async (ctx: Context) => {
        const userId = ctx.from?.id;
        if (!userId) return;

        const unsubscribedChannels = await getUnsubscribedChannels(this, userId);

        if (unsubscribedChannels.length) {
            this.askToSubscribe(ctx, unsubscribedChannels);
            return;
        }

        const query = ctx.text?.slice(5);
        if (!query) {
            ctx.reply("Укажите номер фильма!");
            return;
        }

        const internalId = Number.parseInt(query);

        const movie: Film | undefined = await this.filmRepository.getByInternalId(internalId);

        if (!movie) {
            ctx.reply("Фильм с указанным номером не найден, проверьте правильность номера.");
            return;
        }

        const caption = `
            Название: ${movie.name}
            Оригинальное название: ${movie.alternative_name}
            Год: ${movie.year}
            Описание: ${movie.short_description}
            Id на кинопоиске: ${movie.external_id}
        `;

        ctx.replyWithPhoto(movie.poster, {
            caption: caption
        });
    }

    helpCommand = async (ctx: Context) => {
        const userId = ctx.from?.id;
        if (!userId) return;

        const isAdmin = await this.adminRepository.getById(userId);

        let messageText = `
Вот список доступных команд: 

1. /start - Проверить подписку на каналы.
2. /get номер_фильма - Получить фильм по его номеру.
3. /help - Список комманд.
        `;
        if (isAdmin) {
            messageText += `
Команды, доступные для админов:

1. /add название_фильма - добавить фильм и получить его номер.
            `
        }

        ctx.reply(messageText);
    }

    askToSubscribe = async (ctx: Context, unsubscribedChannels: Channel[]) => {
        let inlineKeyboard: InlineKeyboardButton[][] = [];
        unsubscribedChannels.forEach((value, index, array) => {
            const channelLinkButton: InlineKeyboardButton = {
                url: `https://t.me/${value.username}`,
                text: value.username,
            };
            inlineKeyboard.push([channelLinkButton]);
        });

        ctx.reply(
            "Упс, ты подписан не на все каналы. Подпишись на них, чтобы получить доступ к фильмам.",
            {
                reply_markup: { inline_keyboard: inlineKeyboard, },
            }
        );
    }
}

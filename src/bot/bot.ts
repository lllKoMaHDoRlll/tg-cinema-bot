import { ADD_MOVIE_SUCCESS, ADMINS_COMMANDS_LIST, MOVIE_DESCRIPTION, NO_MOVIE_FOUND_WITH_ID, NOT_ADMIN_ALERT, NOT_SUBSCRIBED_ALERT, REQUEST_MOVIE_ID, REQUEST_MOVIE_NAME, SUBSCRIBED_CONGRATULATION, USER_COMMANDS_LIST } from './../utils/messages.template';
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
            ctx.reply(SUBSCRIBED_CONGRATULATION());
        }
    };

    addMovieCommand = async (ctx: Context) => {
        if (ctx.from?.is_bot) return;

        const userId = ctx.from?.id;
        if (!userId) return;
        const isAdmin = await this.adminRepository.getById(userId);

        if (!isAdmin) {
            console.log(userId + ": " + ctx.from.first_name);
            ctx.reply(NOT_ADMIN_ALERT());
            return;
        }

        const query = ctx.text?.slice(5);
        if (!query) {
            ctx.reply(REQUEST_MOVIE_NAME());
            return;
        }

        const movie = await searchMovie(query);

        await this.filmRepository.create(movie);

        ctx.replyWithPhoto(movie.poster, {
            caption: ADD_MOVIE_SUCCESS(movie.name, movie.internal_id)
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
            ctx.reply(REQUEST_MOVIE_ID());
            return;
        }

        const internalId = Number.parseInt(query);

        const movie: Film | undefined = await this.filmRepository.getByInternalId(internalId);

        if (!movie) {
            ctx.reply(NO_MOVIE_FOUND_WITH_ID());
            return;
        }

        ctx.replyWithPhoto(movie.poster, {
            caption: MOVIE_DESCRIPTION(movie.name, movie.alternative_name, movie.year, movie.short_description, movie.external_id)
        });
    }

    helpCommand = async (ctx: Context) => {
        const userId = ctx.from?.id;
        if (!userId) return;

        const isAdmin = await this.adminRepository.getById(userId);

        let messageText = USER_COMMANDS_LIST();
        if (isAdmin) {
            messageText += "\n" + ADMINS_COMMANDS_LIST()
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
            NOT_SUBSCRIBED_ALERT(),
            {
                reply_markup: { inline_keyboard: inlineKeyboard, },
            }
        );
    }
}

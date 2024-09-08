import dotenv from "dotenv";
import Bot from "./bot/bot";

dotenv.config();

const bot = new Bot(process.env.TG_TOKEN_BOT!);

bot.runBot();

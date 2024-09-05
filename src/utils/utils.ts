import { randomInt } from "crypto";
import Bot from "../bot/bot";

const getUnsubscribedChannels = async (bot: Bot, userId: number): Promise<string[]> => {
    let channels = await getChannels();
    channels.filter(async (value, index, array) => {
        return !["creator", "administrator", "member"].includes((await bot.bot.telegram.getChatMember(value, userId)).status);
    });

    return channels;
}

const getChannels = async (): Promise<string[]> => {
    return [];
}

const generateInternalId = (): number => {
    return randomInt(1000);
}

export { getUnsubscribedChannels, generateInternalId };

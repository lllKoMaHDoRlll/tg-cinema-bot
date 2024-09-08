import { randomInt } from "crypto";
import Bot from "../bot/bot";
import Channel from "../db/models/channel.model";

const getUnsubscribedChannels = async (bot: Bot, userId: number): Promise<Channel[]> => {
    let channels = await bot.channelRepository.getAll();
    let unsubscibedChannels: Channel[] = [];

    for (let index in channels) {
        const channel = channels[index];
        const memberStatus = (await bot.bot.telegram.getChatMember(channel.username, userId)).status;
        const isMember = ["creator", "administrator", "member"].includes(memberStatus);
        if (!isMember) {
            unsubscibedChannels.push(channel);
        }
    }

    return unsubscibedChannels;
}

const generateInternalId = (): number => {
    return randomInt(1000);
}

export { getUnsubscribedChannels, generateInternalId };

import Channel from "../models/channel.model";
import connection from "../";

interface IChannelRepository {
    getAll(): Promise<Channel[]>;
    create(channelUsername: string): Promise<void>;
}

class ChannelRepository implements IChannelRepository {
    getAll(): Promise<Channel[]> {
        return new Promise((resolve, reject) => {
            connection.query<Channel[]> (
                "SELECT * FROM channels",
                [],
                (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                }
            );
        });
    }
    create(channelUsername: string): Promise<void> {
        return new Promise((resolve, reject) => {
            connection.query(
                "INSERT INTO channels (username) VALUES (?)",
                [channelUsername],
                (err, res) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    }
}

export default new ChannelRepository();
import Channel from "../models/channel.model";
import connection from "../";

interface IChannelRepository {
    getAll(): Promise<Channel[]>;
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
}

export default new ChannelRepository();
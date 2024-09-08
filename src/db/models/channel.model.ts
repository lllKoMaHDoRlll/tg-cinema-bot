import { RowDataPacket } from "mysql2";

export default interface Channel extends RowDataPacket {
    id: number;
    username: string;
}
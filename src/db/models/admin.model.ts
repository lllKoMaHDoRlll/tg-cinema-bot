import { RowDataPacket } from "mysql2";

export default interface Admin extends RowDataPacket {
    id: number;
    first_name: string;
}
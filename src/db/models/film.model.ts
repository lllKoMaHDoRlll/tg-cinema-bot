import { RowDataPacket } from "mysql2";

export default interface Film extends RowDataPacket {
    id?: number, 
    name: string,
    alternative_name: string
    external_id: number
    internal_id: number
    year: number
    description: string
    short_description: string
    poster: string
}

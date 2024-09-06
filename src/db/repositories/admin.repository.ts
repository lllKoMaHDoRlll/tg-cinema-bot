import Admin from "../models/admin.model";
import connection from "../";

interface IAdminRepository {
    getById(id: number): Promise<Admin | undefined>;
    getAll(): Promise<Admin[]>;
}

class AdminRepository implements IAdminRepository {
    getById(id: number): Promise<Admin | undefined> {
        return new Promise((resolve, reject) => {
            connection.query<Admin[]> (
                "SELECT * FROM admins WHERE id = ?",
                [id],
                (err, res) => {
                    if (err) reject(err);
                    else resolve(res?.[0]);
                }
            );
        });
    }

    getAll(): Promise<Admin[]> {
        return new Promise((resolve, reject) => {
            connection.query<Admin[]> (
                "SELECT * FROM admins",
                [],
                (err, res) => {
                    if (err) reject(err);
                    else resolve(res);
                }
            );
        });
    }
}

export default new AdminRepository();

import connection from "../";
import { Movie } from "../../types/movies/movies";
import Film from "../models/film.model";

interface IFilmRepository {
    create(film: Movie): Promise<void>;
    getByInternalId(internalId: number): Promise<Film | undefined>;
}

class FilmRepository implements IFilmRepository {
    create(film: Movie): Promise<void> {
        return new Promise((resolve, reject) => {
            connection.query(
                "INSERT INTO films (name, alternative_name, external_id, internal_id, year, description, short_description, poster) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [film.name, film.alternative_name, film.external_id, film.internal_id, film.year, film.description, film.short_description, film.poster],
                (err, res) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    }

    getByInternalId(internalId: number): Promise<Film | undefined> {
        return new Promise((resolve, reject) => {
            connection.query<Film[]>(
                "SELECT * FROM films WHERE internal_id = ?",
                [internalId],
                (err, res) => {
                    if (err) reject(err);
                    else resolve(res?.[0]);
                }
            );
        });
    }
}

export default new FilmRepository();
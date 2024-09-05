import axios from "axios";
import qs from "qs";
import { Movie } from "../../types/movies/movies";


const searchMovie = async (query: string, page: number = 1, limit: number = 10): Promise<Movie> => {
    const result = await axios.get(
        "https://api.kinopoisk.dev/v1.4/movie/search",
        {
            params: {
                page: page,
                limit: limit,
                query: query
            },
            paramsSerializer: params => {
                return qs.stringify(params);
            },
            headers: {
                "X-API-KEY": process.env.KINOPOISK_API_KEY,
                "Accept": "application/json",
            }
        }
    );
    if (result.status !== 200) throw new Error("Making request failed!");

    const movie: Movie = {
        name: result.data.docs[0].name,
        alternativeName: result.data.docs[0].alternativeName,
        id: result.data.docs[0].id,
        year: result.data.docs[0].year,
        description: result.data.docs[0].description,
        shortDescription: result.data.docs[0].shortDescription,
        poster: result.data.docs[0].poster.url
    };
    return movie;
}

export {searchMovie};

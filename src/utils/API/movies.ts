import axios from "axios";
import qs from "qs";
import { Movie } from "../../types/movies/movies";
import { generateInternalId } from "../utils";
import { makeRequest } from "./api_utils";


const searchMovie = async (query: string, page: number = 1, limit: number = 10): Promise<Movie> => {
    const result = await makeRequest("/v1.4/movie/search", {
        page: page,
        limit: limit,
        query: query
    });

    if (result.status !== 200) throw new Error("Making request failed!");

    const movie: Movie = {
        name: result.data.docs[0].name,
        alternative_name: result.data.docs[0].alternativeName,
        external_id: result.data.docs[0].id,
        internal_id: generateInternalId(),
        year: result.data.docs[0].year,
        description: result.data.docs[0].description,
        short_description: result.data.docs[0].shortDescription,
        poster: result.data.docs[0].poster.url
    };
    return movie;
}

export {searchMovie};

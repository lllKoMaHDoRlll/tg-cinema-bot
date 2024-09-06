import axios, { AxiosResponse } from "axios";
import qs from "qs";

const makeRequest = async (method_name: string, params: Object): Promise<AxiosResponse<any, any>> => {
    return axios.get(
        process.env.KINOPOISK_API_URL + method_name, 
        {
            params: params,
            paramsSerializer: params => {
                return qs.stringify(params);
            },
            headers: {
                "X-API-KEY": process.env.KINOPOISK_API_KEY,
                "Accept": "application/json",
            }
        }
    );
}

export { makeRequest };

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { IMedia } from '../../models/media';
import { IRadarrQueue } from '../../models/radarrMovies';
import { IMovieSettings, ISettings } from '../../models/settings'
import { getSettings } from './settings';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<IMedia[]>
) {
    const movies = await getMovies();
    res.status(200).json(movies)
}

export async function getMovies(overrideSettings?: ISettings): Promise<IMedia[]> {
    const settings = overrideSettings ?? await getSettings();

    const getMovieUrl = getServiceUrl(settings.integrationSettings.movies, "/movie");

    const result = await fetch(getMovieUrl);

    if (result.ok) {
        return result.json();
    }

    return [];
}

export async function getQueue(overrideSettings?: ISettings): Promise<IRadarrQueue> {
    const settings = overrideSettings ?? await getSettings();
    const getQueueUrl = getServiceUrl(settings.integrationSettings.movies, "/queue", "&pageSize=20&includeUnknownMovieItems=false");

    const result = await fetch(getQueueUrl);

    if (result.ok) {
        return result.json();
    }

    throw new Error("Cannot get Radarr Queue")
}

const getServiceUrl = (movieSettings: IMovieSettings, relativeServiceUrl: string, queryString?: string) => {
    var apiKey = movieSettings.apiKey;
    var port = movieSettings.port;
    var host = movieSettings.host;
    var useSsl = movieSettings.useSsl;
    var baseUrl = movieSettings.baseUrl;
    var protocol = useSsl ? "https://" : "http://";

    var serviceUrl = `${protocol}${host}:${port}${baseUrl}/api/v3${relativeServiceUrl}?apiKey=${apiKey}`;

    if (queryString) {
        serviceUrl = serviceUrl.concat(queryString);
    }

    return serviceUrl;
}

export const getItemTypeAndUrl = (media: IMedia, baseUrl: string, imageBaseUrl: string, apiKey: string) => {
    const imageUrl = media.images.find(image => image.coverType == "poster");
    const url = imageBaseUrl + imageUrl?.url?.replace(baseUrl, "") + `&apikey=${apiKey}`;
    const itemType = url.includes("radarr") ? "movie" : "series";

    return { url, itemType };
}
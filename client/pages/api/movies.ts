// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiResponse } from 'next'
import { IMedia } from '../../models/media';
import { IRadarrMovie, IRadarrQueue } from '../../models/radarrMovies';
import { IMovieSettings, ISettings } from '../../models/settings'
import { ISonarrRootFolder } from '../../models/sonarrSeries';
import { getSettings } from './settings';

export default async function handler(
    res: NextApiResponse<IMedia[]>
) {
    const movies = await getMovies();
    res.status(200).json(movies)
}

const API_BASE_URL = "/api/v3";

export async function getMovies(overrideSettings?: ISettings): Promise<IMedia[]> {
    const settings = overrideSettings ?? await getSettings();

    const getMovieUrl = getServiceUrl(settings.integrationSettings.movies, `${API_BASE_URL}/movie`);

    const result = await fetch(getMovieUrl);

    if (result.ok) {
        return result.json();
    }

    return [];
}

export async function getMovieLookup(overrideSettings?: ISettings, tmdbId?: number): Promise<IRadarrMovie> {
    const settings = overrideSettings ?? await getSettings();
    const getMovieUrl = getServiceUrl(settings.integrationSettings.movies, `${API_BASE_URL}/movie/lookup/tmdb`, `&tmdbId=${tmdbId}`);

    const result = await fetch(getMovieUrl);

    if (result.ok) {
        return result.json();
    }

    throw new Error("Error retrieving Movie");
}

export async function requestMovie(media: IRadarrMovie, overrideSettings?: ISettings): Promise<IRadarrMovie> {
    const settings = overrideSettings ?? await getSettings();

    const apikey = settings.integrationSettings.movies.apiKey;
    const rootFolderPath = (await getRootFolder(settings)).path;

    const movieRequestBody: IRadarrMovie = {
        ...media,
        qualityProfileId: 1,
        apikey,
        monitored: true,
        rootFolderPath: "/home/rydersir/media/Movies"
    }

    var requestMovieUrl = getServiceUrl(settings.integrationSettings.movies, `${API_BASE_URL}/movie`);

    const result = await fetch(requestMovieUrl, {
        method: 'POST',
        body: JSON.stringify(movieRequestBody),
        headers: {
            'X-Api-Key': apikey,
            'content-type': 'application/json'
        }
    });

    if (result.ok) {
        return result.json();
    }

    return media;
}

export async function getRootFolder(overrideSettings?: ISettings): Promise<ISonarrRootFolder> {
    const settings = overrideSettings ?? await getSettings();

    const getRootFolderUrl = getServiceUrl(settings.integrationSettings.movies, `${API_BASE_URL}/rootfolder`);

    const result = await fetch(getRootFolderUrl);

    if (result.ok) {
        return result.json();
    }

    return { path: "", accessible: false };
}

export async function getQueue(overrideSettings?: ISettings): Promise<IRadarrQueue> {
    const settings = overrideSettings ?? await getSettings();
    const getQueueUrl = getServiceUrl(settings.integrationSettings.movies, `${API_BASE_URL}/queue`, "&pageSize=20&includeUnknownMovieItems=false");

    const result = await fetch(getQueueUrl);

    if (result.ok) {
        return result.json();
    }

    throw new Error("Cannot get Radarr Queue")
}

export const getServiceUrl = (movieSettings: IMovieSettings, relativeServiceUrl: string, queryString?: string) => {
    var apiKey = movieSettings.apiKey;
    var port = movieSettings.port;
    var host = movieSettings.host;
    var useSsl = movieSettings.useSsl;
    var baseUrl = movieSettings.baseUrl;
    var protocol = useSsl ? "https://" : "http://";

    var serviceUrl = `${protocol}${host}:${port}${baseUrl}${relativeServiceUrl}?apiKey=${apiKey}`;

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
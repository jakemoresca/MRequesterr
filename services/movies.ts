import useSWR, { mutate } from 'swr';
import { IMedia } from '../models/media';
import { IRadarrMovie, IRadarrQueue } from '../models/radarrMovies';
import { IMovieSettings, ISettings } from '../models/settings'
import { ISonarrRootFolder } from '../models/sonarrSeries';
import { getSettings } from './settings';

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

export function useMovies(overrideSettings: ISettings) {
    const settings = overrideSettings;
    const getMovieUrl = getServiceUrl(settings.integrationSettings.movies, `${API_BASE_URL}/movie`);

    const fetcher = (url: string): Promise<IMedia[]> => fetch(url).then(r => r.json())
    const { data, error } = useSWR(getMovieUrl, fetcher)

    return {
        movies: data,
        isMoviesLoading: !error && !data,
        isError: error
    }
}

export function useAvailableMovies(overrideSettings: ISettings) {
    var { movies, isMoviesLoading, isError } = useMovies(overrideSettings);
    var availableMovies = (movies ?? []).filter(x => x.hasFile);

    return {
        movies: availableMovies,
        isMoviesLoading: isMoviesLoading,
        isError: isError
    }
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

export function useMovieLookup(overrideSettings: ISettings, tmdbId?: number) {
    const settings = overrideSettings;
    const getMovieUrl = getServiceUrl(settings.integrationSettings.movies, `${API_BASE_URL}/movie/lookup/tmdb`, `&tmdbId=${tmdbId}`);

    const fetcher = (url: string): Promise<IRadarrMovie> => fetch(url).then(r => r.json())
    const { data, error } = useSWR(() => getMovieUrl, fetcher)

    return {
        movieLookup: data,
        isLookupLoading: !error && !data,
        isError: error
    }
}

export async function requestMovie(media: IRadarrMovie, overrideSettings?: ISettings): Promise<IRadarrMovie> {
    const settings = overrideSettings ?? await getSettings();

    const apikey = settings.integrationSettings.movies.apiKey;
    const rootFolderPath = (await getRootFolder(settings))[0];

    const movieRequestBody: IRadarrMovie = {
        ...media,
        qualityProfileId: 1,
        apikey,
        monitored: true,
        rootFolderPath: rootFolderPath.path,
        addOptions: { searchForMovie: true }
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
        // tell all SWRs with this key to revalidate
        const getMovieUrl = getServiceUrl(settings.integrationSettings.movies, `${API_BASE_URL}/movie`);
        mutate(getMovieUrl);

        return result.json();
    }

    return media;
}

export async function getRootFolder(overrideSettings?: ISettings): Promise<ISonarrRootFolder[]> {
    const settings = overrideSettings ?? await getSettings();

    const getRootFolderUrl = getServiceUrl(settings.integrationSettings.movies, `${API_BASE_URL}/rootfolder`);

    const result = await fetch(getRootFolderUrl);

    if (result.ok) {
        const results: Promise<ISonarrRootFolder[]> = result.json();
        return results;
    }

    throw new Error("Error retrieving Movies Folder");
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

export function useRadarrQueue(overrideSettings: ISettings) {
    const settings = overrideSettings;
    const getQueueUrl = getServiceUrl(settings.integrationSettings.movies, `${API_BASE_URL}/queue`, "&pageSize=20&includeUnknownMovieItems=false");

    const fetcher = (url: string): Promise<IRadarrQueue> => fetch(url).then(r => r.json())
    const { data, error } = useSWR(() => getQueueUrl, fetcher, { refreshInterval: 60000 })

    return {
        radarrQueue: data,
        isQueueLoading: !error && !data,
        isError: error
    }
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
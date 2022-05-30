// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiResponse } from 'next'
import { IMedia } from '../../models/media';
import { ISeriesSettings, ISettings } from '../../models/settings'
import { ISonarrRootFolder, ISonarrSeries } from '../../models/sonarrSeries';
import { getSettings } from './settings';

export default async function handler(
    res: NextApiResponse<IMedia[]>
) {
    const series = await getSeries();
    res.status(200).json(series)
}

const API_BASE_URL = "/api/v3";

export async function getSeries(overrideSettings?: ISettings): Promise<IMedia[]> {
    const settings = overrideSettings ?? await getSettings();

    const getSeriesUrl = getServiceUrl(settings.integrationSettings.series, `${API_BASE_URL}/series`);

    const result = await fetch(getSeriesUrl);

    if (result.ok) {
        return result.json();
    }

    return [];
}

export async function requestSeries(media: ISonarrSeries, overrideSettings?: ISettings): Promise<ISonarrSeries> {
    const settings = overrideSettings ?? await getSettings();

    const apikey = settings.integrationSettings.series.apiKey;
    const rootFolderPath = (await getRootFolder(settings))[0];

    const seriesRequestBody: ISonarrSeries = {
        ...media,
        seasonFolder: true,
        rootFolderPath: rootFolderPath.path,
        qualityProfileId: 1,
        languageProfileId: 1,
        apikey,
        addOptions: {
            monitor: "all",
            searchForCutoffUnmetEpisodes: false,
            searchForMissingEpisodes: false
        }
    }

    var requestSeriesUrl = getServiceUrl(settings.integrationSettings.series, `${API_BASE_URL}/series`);

    const result = await fetch(requestSeriesUrl, {
        method: 'POST',
        body: JSON.stringify(seriesRequestBody),
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

export async function updateRequestSeries(media: ISonarrSeries, overrideSettings?: ISettings): Promise<ISonarrSeries> {
    const settings = overrideSettings ?? await getSettings();

    const apikey = settings.integrationSettings.series.apiKey;

    const getSeriesUrl = getServiceUrl(settings.integrationSettings.series, `${API_BASE_URL}/series/${media.id}`);
    const seriesResult = await fetch(getSeriesUrl);
    const sonarrSeries = await seriesResult.json() as ISonarrSeries;

    const seriesRequestBody: ISonarrSeries = {
        ...sonarrSeries,
        apikey,
        seasons: media.seasons.map(season => {
            var origSeason = sonarrSeries.seasons.find(x => x.seasonNumber == season.seasonNumber) ?? season;
            return {...season, statistics: {...origSeason.statistics }}
        })
    }

    const result = await fetch(getSeriesUrl, {
        method: "PUT",
        body: JSON.stringify(seriesRequestBody),
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

export async function getSeriesLookup(overrideSettings?: ISettings, title?: string): Promise<ISonarrSeries> {
    const settings = overrideSettings ?? await getSettings();
    const getSeriesUrl = getServiceUrl(settings.integrationSettings.series, `${API_BASE_URL}/series/lookup`, `&term=${title}`);

    const result = await fetch(getSeriesUrl);

    if (result.ok) {
        const results: Promise<ISonarrSeries[]> = result.json();

        return (await results)[0];
    }

    throw new Error("Error retrieving Series");
}

export async function getRootFolder(overrideSettings?: ISettings): Promise<ISonarrRootFolder[]> {
    const settings = overrideSettings ?? await getSettings();

    const getRootFolderUrl = getServiceUrl(settings.integrationSettings.series, `${API_BASE_URL}/rootfolder`);

    const result = await fetch(getRootFolderUrl);

    if (result.ok) {
        const results: Promise<ISonarrRootFolder[]> = result.json();
        return results;
    }

    throw new Error("Error retrieving Series Folder");
}

export const getServiceUrl = (seriesSettings: ISeriesSettings, relativeServiceUrl: string, queryString?: string) => {
    var apiKey = seriesSettings.apiKey;
    var port = seriesSettings.port;
    var host = seriesSettings.host;
    var useSsl = seriesSettings.useSsl;
    var baseUrl = seriesSettings.baseUrl;
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
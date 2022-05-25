// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { IMedia } from '../../models/media';
import { ISeriesSettings, ISettings } from '../../models/settings'
import { getSettings } from './settings';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<IMedia[]>
) {
    const series = await getSeries();
    res.status(200).json(series)
}

export async function getSeries(overrideSettings?: ISettings): Promise<IMedia[]> {
    const settings = overrideSettings ?? await getSettings();

    const getSeriesUrl = getServiceUrl(settings.integrationSettings.series, "/series");

    const result = await fetch(getSeriesUrl);

    if(result.ok)
    {
        return result.json();
    }

    return [];
}

const getServiceUrl = (seriesSettings: ISeriesSettings, relativeServiceUrl: string) => {
    var apiKey = seriesSettings.apiKey;
    var port = seriesSettings.port;
    var host = seriesSettings.host;
    var useSsl = seriesSettings.useSsl;
    var baseUrl = seriesSettings.baseUrl;
    var protocol = useSsl ? "https://" : "http://";

    var serviceUrl = `${protocol}${host}:${port}${baseUrl}/api/v3${relativeServiceUrl}?apiKey=${apiKey}`;

    return serviceUrl;
}

export const getItemTypeAndUrl = (media: IMedia, baseUrl: string, imageBaseUrl: string, apiKey: string) => {
    const imageUrl = media.images.find(image => image.coverType == "poster");
    const url = imageBaseUrl + imageUrl?.url?.replace(baseUrl, "") + `&apikey=${apiKey}`;
    const itemType = url.includes("radarr") ? "movie" : "series";

    return { url, itemType };
}
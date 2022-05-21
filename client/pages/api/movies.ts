// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { IMedia } from '../../models/media';
import { IMovieSettings } from '../../models/settings'
import { getSettings } from './settings';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<IMedia[]>
) {
    const movies = await getMovies();
    res.status(200).json(movies)
}

export async function getMovies(): Promise<IMedia[]> {
    const settings = await getSettings();

    const getMovieUrl = getServiceUrl(settings.integrationSettings.movies, "/movie");

    const result = await fetch(getMovieUrl);

    if(result.ok)
    {
        return result.json();
    }

    return [];
}

const getServiceUrl = (movieSettings: IMovieSettings, relativeServiceUrl: string) => {
    var apiKey = movieSettings.apiKey;
    var port = movieSettings.port;
    var host = movieSettings.host;
    var useSsl = movieSettings.useSsl;
    var baseUrl = movieSettings.baseUrl;
    var protocol = useSsl ? "https://" : "http://";

    var serviceUrl = `${protocol}${host}:${port}${baseUrl}/api/v3${relativeServiceUrl}?apiKey=${apiKey}`;

    return serviceUrl;
}

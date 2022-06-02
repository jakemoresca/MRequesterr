// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiResponse } from 'next'
import { IAuthSettings, ISettings } from '../../models/settings'
import { IAuthState } from '../../states/auth';
import { getSettings } from './settings';

export default async function handler(
    res: NextApiResponse<ISettings>
) {
    const movies = await getSettings();
    res.status(200).json(movies)
}

export async function login(username?: string, password?: string, overrideSettings?: ISettings): Promise<IAuthState> {
    const settings = overrideSettings ?? await getSettings();

    const body = {
        "Username": username,
        "Pw": password
    };

    const loginUrl = getServiceUrl(settings.integrationSettings.auth, "/Users/AuthenticateByName");
    const loginResult = await fetch(loginUrl, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'x-emby-authorization': 'MediaBrowser Client="Custom Client", Device="Custom Device", DeviceId="1", Version="0.0.1"',
            'content-type': 'application/json'
        }
    });

    if (loginResult.ok) {
        return loginResult.json();
    }

    return { AccessToken: "", ServerId: "" };
}


const getServiceUrl = (authSettings: IAuthSettings, relativeServiceUrl: string, queryString?: string) => {
    var apiKey = authSettings.apiKey;
    var port = authSettings.port;
    var host = authSettings.host;
    var useSsl = authSettings.useSsl;
    var baseUrl = authSettings.baseUrl;
    var protocol = useSsl ? "https://" : "http://";

    var serviceUrl = `${protocol}${host}:${port}${baseUrl}${relativeServiceUrl}?apiKey=${apiKey}`;

    if (queryString) {
        serviceUrl = serviceUrl.concat(queryString);
    }

    return serviceUrl;
}
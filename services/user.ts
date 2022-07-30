import { IAuthSettings, ISettings } from '../models/settings'
import { IAuthState } from '../states/auth';
import { getSettings } from './settings';
import { PlexOauth, IPlexClientDetails } from "plex-oauth"

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

export async function createUser(username?: string, password?: string, referrer?: string, overrideSettings?: ISettings): Promise<IAuthState> {
    const settings = overrideSettings ?? await getSettings();
    const isValidReferrer = await getReferrer(referrer, overrideSettings);

    if(!isValidReferrer) {
        return { AccessToken: "", ServerId: "" };
    }

    const body = {
        "Name": username,
        "Password": password
    };

    const createUserUrl = getServiceUrl(settings.integrationSettings.auth, "/Users/New");
    const createUserResult = await fetch(createUserUrl, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'x-emby-authorization': 'MediaBrowser Client="Custom Client", Device="Custom Device", DeviceId="1", Version="0.0.1"',
            'content-type': 'application/json'
        }
    });

    if (createUserResult.ok) {
        return createUserResult.json();
    }

    return { AccessToken: "", ServerId: "" };
}

export async function getReferrer(referrer?: string, overrideSettings?: ISettings) {
    const settings = overrideSettings ?? await getSettings();
    const getUsersUrl = getServiceUrl(settings.integrationSettings.auth, "/Users");

    const getUsersResult = await fetch(getUsersUrl, {
        method: 'GET',
        headers: {
            'x-emby-authorization': 'MediaBrowser Client="Custom Client", Device="Custom Device", DeviceId="1", Version="0.0.1"',
            'content-type': 'application/json'
        }
    });

    if(getUsersResult.ok) {
        const result: Array<any> = await getUsersResult.json();
        const referrerUser = result.filter(x => x.Name == referrer);

        return referrerUser.length > 0;
    }

    return false;
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

export async function plexLogin(callback: (authState: IAuthState) => void) {
    let clientInformation: IPlexClientDetails = {
        clientIdentifier: "RYDERSIR_MREQUESTERR", // This is a unique identifier used to identify your app with Plex.
        product: "RYDERSIR",              // Name of your application
        device: "RYDERSIR DEVICE",            // The type of device your application is running on
        version: "1",                               // Version of your application
        forwardUrl: `${window.location.href}/redirect`,       // Url to forward back to after signing in.
        platform: "Web",                            // Optional - Platform your application runs on - Defaults to 'Web'
    }

    const plexOauth = new PlexOauth(clientInformation);

    // Get hosted UI URL and Pin Id
    const data = await plexOauth.requestHostedLoginURL();
    const [hostedUILink, pinId] = data;

    var child = window.open(hostedUILink, '', 'toolbar=0,status=0,width=626,height=436') as Window;
    var timer = setInterval(checkChild, 500);

    function checkChild() {
        if (child.closed) {
            // Check for the auth token, once returning to the application
            plexOauth.checkForAuthToken(pinId).then(authToken => {
                //console.log(authToken); // Returns the auth token if set, otherwise returns null
                callback({ AccessToken: authToken ?? undefined, ServerId: "" });
            }).catch(err => {
                throw err;
            });

            clearInterval(timer);
        }
    }
}
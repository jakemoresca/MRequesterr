export interface ISettings
{
    integrationSettings: IIntegrationSettings;
    plexLogin: boolean;
}

export interface IIntegrationSettings
{
    movies: IMovieSettings;
    series: ISeriesSettings;
    auth: IAuthSettings;
    discordWebhookUrl: string;
}

export interface IMovieSettings
{
    baseUrl: string;
    apiKey: string;
    host: string;
    port?: number;
    useSsl: boolean;
}

export interface ISeriesSettings
{
    baseUrl: string;
    apiKey: string;
    host: string;
    port?: number;
    useSsl: boolean;
}

export interface IAuthSettings
{
    baseUrl: string;
    apiKey: string;
    host: string;
    port?: number;
    useSsl: boolean;
}
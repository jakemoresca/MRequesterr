export interface ISettings
{
    integrationSettings: IIntegrationSettings;
}

export interface IIntegrationSettings
{
    movies: IMovieSettings;
    series: ISeriesSettings;
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
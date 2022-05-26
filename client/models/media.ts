import { ISonarrSeries } from "./sonarrSeries";

export interface IMedia 
{
    id: string;
    tmdbId?: string;
    imdbId: string;
    tvdbId?: string;
    title: string;
    cleanTitle: string;
    sortTitle: string;
    status: string;
    overview: string;
    monitored: boolean;
    minimumAvailability: string;
    //profileId: number;
    runtime: number;
    images: IMediaImage[],
    //titleSlug: string;
    path: string;
    year: number;
    genres: string[];
    isAvailable: boolean;
    statistics: IStatistics;
    additionalInfo?: AdditionalMediaInfo;
}

export type AdditionalMediaInfo = ISonarrSeries | undefined;

export interface IMediaImage 
{
    coverType: string;
    url: string;
}

export interface IStatistics 
{
    percentOfEpisodes: number;
}
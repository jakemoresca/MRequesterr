import { IRadarrMovie, RadarrQueueRecord } from "./radarrMovies";
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
    images: IMediaImage[];
    titleSlug: string;
    path: string;
    year: number;
    genres: string[];
    isAvailable: boolean;
    hasFile: boolean;
    statistics: IStatistics;
    additionalInfo?: AdditionalMediaInfo;
    movieFile?: MovieFile;
    firstAired?: string;
}

export type AdditionalMediaInfo = ISonarrSeries | RadarrQueueRecord | IRadarrMovie | undefined;

export interface IMediaImage 
{
    coverType: string;
    url: string;
}

export interface IStatistics 
{
    percentOfEpisodes: number;
}

export interface MovieFile {
    movieId:             number;
    relativePath:        string;
    path:                string;
    size:                number;
    dateAdded:           Date;
    indexerFlags:        number;
    quality:             Welcome4Quality;
    mediaInfo:           MediaInfo;
    originalFilePath:    string;
    qualityCutoffNotMet: boolean;
    languages:           Language[];
    releaseGroup:        string;
    edition:             string;
    id:                  number;
}

export interface Language {
    id:   number;
    name: string;
}

export interface MediaInfo {
    audioBitrate:          number;
    audioChannels:         number;
    audioCodec:            string;
    audioLanguages:        string;
    audioStreamCount:      number;
    videoBitDepth:         number;
    videoBitrate:          number;
    videoCodec:            string;
    videoDynamicRangeType: string;
    videoFps:              number;
    resolution:            string;
    runTime:               string;
    scanType:              string;
    subtitles:             string;
}

export interface Welcome4Quality {
    quality:  QualityQuality;
    revision: Revision;
}

export interface QualityQuality {
    id:         number;
    name:       string;
    source:     string;
    resolution: number;
    modifier:   string;
}

export interface Revision {
    version:  number;
    real:     number;
    isRepack: boolean;
}

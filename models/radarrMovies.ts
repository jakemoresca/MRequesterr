export interface IRadarrQueue {
    records: RadarrQueueRecord[];
}

export interface RadarrQueueRecord {
    movieId: number;
    languages: Language[];
    quality: RecordQuality;
    customFormats: any[];
    size: number;
    title: string;
    sizeleft: number;
    timeleft: string;
    estimatedCompletionTime: Date;
    status: string;
    trackedDownloadStatus: string;
    trackedDownloadState: string;
    statusMessages: any[];
    downloadId: string;
    protocol: string;
    downloadClient: string;
    indexer: string;
    outputPath: string;
    id: number;
}

export interface Language {
    id: number;
    name: string;
}

export interface RecordQuality {
    quality: QualityQuality;
    revision: Revision;
}

export interface QualityQuality {
    id: number;
    name: string;
    source: string;
    resolution: number;
    modifier: string;
}

export interface Revision {
    version: number;
    real: number;
    isRepack: boolean;
}

export interface IRadarrMovie {
    title: string;
    originalTitle: string;
    originalLanguage: Language;
    alternateTitles: AlternateTitle[];
    secondaryYearSourceId: number;
    sortTitle: string;
    sizeOnDisk: number;
    status: string;
    overview: string;
    inCinemas: Date;
    physicalRelease: Date;
    digitalRelease: Date;
    images: Image[];
    website: string;
    remotePoster: string;
    year: number;
    hasFile: boolean;
    youTubeTrailerId: string;
    studio: string;
    qualityProfileId: number;
    monitored: boolean;
    minimumAvailability: string;
    isAvailable: boolean;
    folderName: string;
    runtime: number;
    cleanTitle: string;
    imdbId: string;
    tmdbId: number;
    titleSlug: string;
    folder: string;
    certification: string;
    genres: string[];
    tags: any[];
    added: Date;
    ratings: Ratings;
    id: number;
    addOptions: AddOptions;
    rootFolderPath: string;
    apikey: string;
}

export interface AddOptions {
    searchForMovie: boolean;
}

export interface AlternateTitle {
    sourceType: SourceType;
    movieId: number;
    title: string;
    sourceId: number;
    votes: number;
    voteCount: number;
    language: Language;
}

export interface Language {
    id: number;
    name: string;
}

export enum SourceType {
    Tmdb = "tmdb",
}

export interface Image {
    coverType: string;
    url: string;
    remoteUrl: string;
}

export interface Ratings {
    imdb: Imdb;
    tmdb: Imdb;
    metacritic: Imdb;
    rottenTomatoes: Imdb;
}

export interface Imdb {
    votes: number;
    value: number;
    type: string;
}


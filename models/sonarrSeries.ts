export interface ISonarrSeries {
    addOptions: any;
    title: string;
    seasons: Season[];
    rootFolderPath: string;
    qualityProfileId: number;
    languageProfileId: number;
    seasonFolder: boolean;
    monitored: boolean;
    tvdbid: number;
    tvRageId: number;
    cleanTitle: null;
    imdbid: null;
    titleSlug: string;
    id: number;
    apikey: string;
}

export interface Season {
    seasonNumber: number;
    monitored: boolean;
    statistics: SeasonStatistics;
}

interface SeasonStatistics {
    previousAiring: string;
    episodeFileCount: number;
    episodeCount: number;
    totalEpisodeCount: number;
    sizeOnDisk: number;
    releaseGroups: string[];
    percentOfEpisodes: number;
}

export interface ISonarrRootFolder {
    path: string;
    accessible: boolean;
    freeSpace: number;
    unmappedFolders: UnmappedFolder[];
    id: number;
}

export interface UnmappedFolder {
    name: string;
    path: string;
}
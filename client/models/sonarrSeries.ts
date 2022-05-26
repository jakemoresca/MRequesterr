export interface ISonarrSeries {
    addOptions:       null;
    title:            string;
    seasons:          Season[];
    rootFolderPath:   string;
    qualityProfileId: number;
    seasonFolder:     boolean;
    monitored:        boolean;
    tvdbid:           number;
    tvRageId:         number;
    cleanTitle:       null;
    imdbid:           null;
    titleSlug:        string;
    id:               number;
}

export interface Season {
    seasonNumber: number;
    monitored:    boolean;
    statistics:   null;
}

export interface ISonarrRootFolder {
    path:       string;
    accessible: boolean;
}
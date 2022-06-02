import { IMediaImage } from "./media";

export interface IMovieRequest {
    title:            string;
    qualityProfileId: number;
    apikey:           string;
    tmdbid:           number;
    titleslug:        string;
    monitored:        boolean;
    rootFolderPath:   string;
    images:           IMediaImage[];
}
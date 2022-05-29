import { atom } from "recoil";
import { IMedia } from "../models/media";
import { IRadarrMovie } from "../models/radarrMovies";
import { ISonarrSeries } from "../models/sonarrSeries";

export type MediaStateType = IMedia | undefined;

export const mediaState = atom<MediaStateType>({
    key: 'media', // unique ID (with respect to other atoms/selectors)
    default: undefined, // default value (aka initial value)
});

export const seriesRequestState = atom<ISonarrSeries>({
    key: 'seriesRequest',
    default: undefined
});

export const movieRequestState = atom<IRadarrMovie>({
    key: 'movieRequest',
    default: undefined
});
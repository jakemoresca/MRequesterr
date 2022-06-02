import { atom } from "recoil";
import { IMedia } from "../models/media";

export const popularMoviesState = atom<IPopularMoviesState>({
    key: 'popularMovies', // unique ID (with respect to other atoms/selectors)
    default: {currentPage: 0, movies: []}, // default value (aka initial value)
});

export const popularSeriesState = atom<IPopularSeriesState>({
    key: 'popularSeries', // unique ID (with respect to other atoms/selectors)
    default: {currentPage: 0, series: []}, // default value (aka initial value)
});

export interface IPopularMoviesState
{
    currentPage: number;
    movies: IMedia[]
}

export interface IPopularSeriesState
{
    currentPage: number;
    series: IMedia[]
}
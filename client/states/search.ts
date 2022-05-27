import { atom } from "recoil";
import { ITmdbSearchResult } from "../models/tmdbSearch";

export const searchResultState = atom<ITmdbSearchResult[]>({
    key: 'searchResult', // unique ID (with respect to other atoms/selectors)
    default: undefined, // default value (aka initial value)
});
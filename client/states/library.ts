import { atom } from "recoil";
import { IMedia } from "../models/media";

export interface IMediaLibrary
{
    movies: IMedia[];
    series: IMedia[];
}

export const mediaLibraryState = atom<IMediaLibrary>({
    key: 'mediaLibrary', // unique ID (with respect to other atoms/selectors)
    default: undefined, // default value (aka initial value)
});
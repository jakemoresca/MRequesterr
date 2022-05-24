import { atom } from "recoil";
import { IMedia } from "../models/media";

export type MediaStateType = IMedia | undefined;

export const mediaState = atom<MediaStateType>({
    key: 'media', // unique ID (with respect to other atoms/selectors)
    default: undefined, // default value (aka initial value)
});
import { atom } from "recoil";
import { ISettings } from "../models/settings";

export const settingsState = atom<ISettings>({
    key: 'settings', // unique ID (with respect to other atoms/selectors)
    default: undefined, // default value (aka initial value)
});
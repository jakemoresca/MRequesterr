import { atom } from "recoil";

export interface IAuthState
{
    AccessToken: string;
    ServerId: string;
}

export const authState = atom<IAuthState>({
    key: 'authState', // unique ID (with respect to other atoms/selectors)
    default: undefined, // default value (aka initial value)
});
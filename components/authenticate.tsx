import { ReactNode, useEffect } from "react";
import { useRecoilState } from "recoil";
import { ISettings } from "../models/settings";
import { authState } from "../states/auth";
import Login from "./login";

export interface AuthenticateProps {
    children?: ReactNode;
    settings: ISettings;
}

const Authenticate = (props: AuthenticateProps) => {
    const [userState, setUserState] = useRecoilState(authState);

    useEffect(() => {
        const authLocalStorage = localStorage.getItem("authStateToken");

        if(userState == undefined) {
            if(authLocalStorage != null) {
                const newState = { AccessToken: authLocalStorage, ServerId: "1" }
                setUserState(newState);
            }
        }
    }, [userState]);

    if (!userState || !userState.AccessToken) {
        return (<Login settings={props.settings} />);
    }

    return (<>{props.children}</>)
}

export default Authenticate;
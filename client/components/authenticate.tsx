import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { useRecoilState } from "recoil";
import { authState } from "../states/auth";

export interface AuthenticateProps {
    children?: ReactNode;
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

    if (!userState) {
        return (<></>);
    }

    return (<>{props.children}</>)
}

export default Authenticate;
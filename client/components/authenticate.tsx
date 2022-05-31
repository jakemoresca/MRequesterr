import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { useRecoilState } from "recoil";
import { authState } from "../states/auth";

export interface AuthenticateProps {
    children?: ReactNode;
}

const Authenticate = (props: AuthenticateProps) => {
    const [userState, setUserState] = useRecoilState(authState);
    const router = useRouter();

    useEffect(() => {

        setTimeout(() => {
            const authLocalStorage = localStorage.getItem("authStateToken");

            if (authLocalStorage) {
                const newState = { AccessToken: authLocalStorage, ServerId: "1" }
                setUserState(newState);
            }
            else {
                if (!userState?.AccessToken) {
                    router.push("/login");
                }
            }
        }, 0);
    }, []);

    if (!userState) {
        return (<></>);
    }

    return (<>{props.children}</>)
}

export default Authenticate;
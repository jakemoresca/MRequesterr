import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { authState } from "../states/auth";

const Authenticate = () => {
    const [userState] = useRecoilState(authState);
    const router = useRouter();

    useEffect(() => {
        if (!userState?.AccessToken) {
            router.push("/login");
        }
    }, []);

    return (<></>)
}

export default Authenticate;
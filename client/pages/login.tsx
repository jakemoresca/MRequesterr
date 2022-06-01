import Head from "next/head";
import { NextRouter, useRouter } from "next/router";
import React, { ChangeEventHandler, FormEventHandler, useState } from "react";
import { Container, Form } from "reactstrap";
import { SetterOrUpdater, useRecoilState } from "recoil";
import { ISettings } from "../models/settings";
import { authState, IAuthState } from "../states/auth";
import { getSettings } from "./api/settings";
import { login } from "./api/user";

export interface LoginState {
    username?: string;
    password?: string;
}

export interface ILoginProps {
    settings: ISettings;
}

const Login = (props: ILoginProps) => {
    const [loginState, setLoginState] = useState<LoginState>({ username: "", password: "" });
    const [_, setAuthState] = useRecoilState(authState)
    const router = useRouter();

    const handleLoginChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const newState = { ...loginState, username: event.currentTarget.value };
        setLoginState(newState);
    }

    const handlePasswordChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const newState = { ...loginState, password: event.currentTarget.value };
        setLoginState(newState);
    }

    const handleLogin: FormEventHandler = async (event) => {
        await loginToJellyfin(loginState, props.settings, setAuthState, router);
        event.defaultPrevented = true;
    }

    return (<Container className="w-100 m-auto py-4 d-flex justify-content-center">
    <Form data-bitwarden-watching="1" style={{ maxWidth: 330 }} className="col align-self-center" action="/" onSubmit={handleLogin}>
        <Head>
            <title>Login</title>
        </Head>
        <svg className="bi me-2" width="30" height="24" style={{ 'fill': 'white' }}><use xlinkHref="#bootstrap"></use></svg>
        <h1 className="h3 mb-3 fw-normal">Please sign in using your Jellyfin account</h1>

        <div className="form-floating">
            <input type="text" className="form-control" id="floatingInput" placeholder="Username" value={loginState?.username} onChange={handleLoginChange} />
            <label htmlFor="floatingInput">Username</label>
        </div>
        <div className="form-floating">
            <input type="password" className="form-control" id="floatingPassword" placeholder="Password" value={loginState?.password} onChange={handlePasswordChange} />
            <label htmlFor="floatingPassword">Password</label>
        </div>


        <button className="w-100 btn btn-lg btn-primary" type="submit" onSubmit={handleLogin}>Sign in</button>
        <p className="mt-5 mb-3 text-muted">© 2022</p>
    </Form>
    </Container>);
};

export async function loginToJellyfin(loginState: LoginState, settings: ISettings, setAuthState: SetterOrUpdater<IAuthState>, router: NextRouter) {
    const result = await login(loginState?.username, loginState?.password, settings);

    if (result.AccessToken) {
        setAuthState(result);
        localStorage.setItem("authStateToken", result.AccessToken);

        router.push("/");
    }
}

export async function getStaticProps() {
    const settings = await getSettings();

    return { props: { settings } }
}

export default Login;
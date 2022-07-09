import Head from "next/head";
import React, { ChangeEventHandler, FormEventHandler, useState } from "react";
import { Button, Container, Form, FormGroup } from "reactstrap";
import { SetterOrUpdater, useRecoilState } from "recoil";
import { ISettings } from "../models/settings";
import { plexLogin, login } from "../services/user";
import { authState, IAuthState } from "../states/auth";

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

    const handleLoginChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const newState = { ...loginState, username: event.currentTarget.value };
        setLoginState(newState);
    }

    const handlePasswordChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        const newState = { ...loginState, password: event.currentTarget.value };
        setLoginState(newState);
    }

    const handleLogin: FormEventHandler = (event) => {
        loginToJellyfin(loginState, props.settings, setAuthState);
        event.preventDefault();

        return false;
    }

    const handlePlexLogin: FormEventHandler = (event) => {
        plexLogin((newState) => loginToPlex(newState, setAuthState));

        event.preventDefault();
        return false;
    }

    const hideJellyfinLogin = true;

    return (<Container className="w-100 m-auto py-4 d-flex justify-content-center">
        <Form data-bitwarden-watching="1" style={{ maxWidth: 330 }} className="col align-self-center" action="/" onSubmit={handlePlexLogin}>
            <Head>
                <title>Login</title>
            </Head>
            <svg className="bi me-2" width="30" height="24" style={{ 'fill': 'white' }}><use xlinkHref="#bootstrap"></use></svg>
            <h1 className="h3 mb-3 fw-normal">Please sign in using your Plex account.</h1>

            {!hideJellyfinLogin &&
                <>
                    <FormGroup row floating disabled>
                        <input type="text" className="form-control" id="floatingInput" placeholder="Username" value={loginState?.username} onChange={handleLoginChange} disabled />
                        <label htmlFor="floatingInput">Username</label>
                    </FormGroup>
                    <FormGroup row floating disabled>
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" value={loginState?.password} onChange={handlePasswordChange} disabled />
                        <label htmlFor="floatingPassword">Password</label>
                    </FormGroup>

                    <Button color="primary" className="w-100" onSubmit={handleLogin} disabled>
                        Sign in
                    </Button>
                    <br />
                </>
            }
            <Button onClick={handlePlexLogin} color="primary" className="w-100">
                Plex Sign in
            </Button>
            <p className="mt-5 mb-3 text-muted">© 2022</p>
        </Form>
    </Container>);
};

export async function loginToJellyfin(loginState: LoginState, settings: ISettings, setAuthState: SetterOrUpdater<IAuthState>) {
    const result = await login(loginState?.username, loginState?.password, settings);

    if (result.AccessToken) {
        setAuthState(result);
        localStorage.setItem("authStateToken", result.AccessToken);
    }
}

export function loginToPlex(newState: IAuthState, setAuthState: SetterOrUpdater<IAuthState>) {
    setAuthState(newState);
    localStorage.setItem("authStateToken", newState.AccessToken ?? "");
}

export default Login;
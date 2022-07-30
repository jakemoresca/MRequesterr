import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import { Button, Avatar, Box, CssBaseline, Grid, Link, Paper, TextField, ThemeProvider, Typography, createTheme, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Head from "next/head";
import React, { FormEventHandler, useState } from "react";
import { SetterOrUpdater, useRecoilState } from "recoil";
import { ISettings } from "../models/settings";
import { plexLogin, login } from "../services/user";
import { authState, IAuthState } from "../states/auth";
import SignUp from "./signup";

export interface LoginState {
    username?: string;
    password?: string;
}

export interface ILoginProps {
    settings: ISettings;
}

function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="mrequesterr.rydersir.es">
                MRequesterr
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

const Login = (props: ILoginProps) => {
    const [_, setAuthState] = useRecoilState(authState)
    const [signUpDialogOpen, setSignUpDialogOpen] = React.useState(false);

    const handlePlexLogin: FormEventHandler = (event) => {
        plexLogin((newState) => loginToPlex(newState, setAuthState));

        event.preventDefault();
        return false;
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        loginToJellyfin(props.settings, setAuthState, data.get('username')?.toString(), data.get('password')?.toString());
    };

    const handleClickOpen = () => {
        setSignUpDialogOpen(true);
    };

    const handleClose = () => {
        setSignUpDialogOpen(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Head>
                <title>Login</title>
            </Head>
            <Grid container component="main" sx={{ height: '100vh', position: "fixed", top: 0 }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(https://source.unsplash.com/random)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in using your Jellyfin account
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link target="_blank" rel="noopener noreferrer" href="https://rydersir.polaris.usbx.me/jellyfin/web/index.html#!/forgotpassword.html" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="#" variant="body2" onClick={handleClickOpen}>
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                            <Copyright sx={{ mt: 5 }} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
            <Dialog open={signUpDialogOpen} onClose={handleClose}>
                <DialogTitle>Sign Up</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To sign up to this website, please enter your desired Username, Password, and your Referrer.
                    </DialogContentText>
                    <SignUp {...props} closeDialog={handleClose} />
                </DialogContent>
            </Dialog>
        </ThemeProvider>
    );
};

export async function loginToJellyfin(settings: ISettings, setAuthState: SetterOrUpdater<IAuthState>, username?: string, password?: string) {
    const result = await login(username, password, settings);

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
import { Grid, Toolbar } from '@mui/material';
import * as React from 'react';
import Icons from './icons';
import NavMenu from './navmenu';

const Layout = (props: { children?: React.ReactNode }) => (
    <React.Fragment>
        <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <Icons />
        <NavMenu />
        <Toolbar />
        <Grid sx={{pt: 1}}>
            {props.children}
        </Grid>
    </React.Fragment>
);

export default Layout;
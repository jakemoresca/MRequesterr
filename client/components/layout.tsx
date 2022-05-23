import * as React from 'react';
import { Container } from 'reactstrap';
import Icons from './icons';
import NavMenu from './navmenu';
import Sidebar from './sidebar';

const Layout = (props: { children?: React.ReactNode }) => (
    <React.Fragment>
        <Icons />
        <Container fluid={true} className="d-flex flex-column min-vh-100 vh-100 p-0">
            <NavMenu />
            <Container fluid={true} className="d-flex flex-row flex-fill p-0">
                <Sidebar />
                <Container fluid={true} className="bg-light">
                    {props.children}
                </Container>
            </Container>
        </Container>
    </React.Fragment>
);

export default Layout;
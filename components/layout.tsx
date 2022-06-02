import * as React from 'react';
import { Container } from 'reactstrap';
import Icons from './icons';
import NavMenu from './navmenu';

const Layout = (props: { children?: React.ReactNode }) => (
    <React.Fragment>
        <Icons />
        <Container fluid={true} className="d-flex flex-column min-vh-100 vh-100 p-0">
            <NavMenu />
            <Container fluid={true} className="d-flex flex-row flex-fill p-0 mt-5">
                <Container fluid={true} className="bg-light pt-5">
                    {props.children}
                </Container>
            </Container>
        </Container>
    </React.Fragment>
);

export default Layout;
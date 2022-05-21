import * as React from 'react';
import { Container } from 'reactstrap';
import Icons from './icons';
import NavMenu from './navmenu';
import Sidebar from './sidebar';

const Layout = (props: { children?: React.ReactNode }) => (
    <React.Fragment>
        <Icons />
        <NavMenu />
        <Container fluid={true} style={{display: 'flex'}}>
            <Sidebar /> 
            <main>
                <div className="vw-100">
                    {props.children}
                </div>
            </main> 
        </Container>
    </React.Fragment>
);

export default Layout;
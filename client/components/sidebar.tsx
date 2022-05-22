import Link from "next/link";
import { Button, Nav, NavItem, NavLink } from "reactstrap";

const Sidebar = () => (
    <Nav vertical pills className="bg-primary col-md-2">
        <NavItem className="nav-item">
            <Link passHref href="/">
                <NavLink className="nav-link">Now Playing</NavLink>
            </Link>
        </NavItem>
        <NavItem className="nav-item">
            <Link passHref href="/discover">
                <NavLink className="nav-link">Discover</NavLink>
            </Link>
        </NavItem>
        <NavItem className="nav-item">
            <Link passHref href="/requests">
                <NavLink className="nav-link">Requests</NavLink>
            </Link>
        </NavItem>
    </Nav>
);

export default Sidebar;
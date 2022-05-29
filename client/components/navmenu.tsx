import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEventHandler, KeyboardEventHandler, useState } from "react";
import { Collapse, Input, Nav, Navbar, NavbarBrand, NavbarText, NavbarToggler, NavItem, NavLink } from "reactstrap";
import { useRecoilState } from "recoil";
import { authState } from "../states/auth";

const NavMenu = () => {
    const router = useRouter();
    const [searchText, setSearchText] = useState<string>("");
    const [, setUserState] = useRecoilState(authState);

    const handleSearch: KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.code === 'Enter') {
            router.push(`/search/${searchText}`)
        }
    }

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setSearchText(event.currentTarget.value);
    }

    const handleLogout = () => {
        setUserState({ AccessToken: "", ServerId: "" });
        router.push("/login");
    }

    return (
        <Navbar color="primary" dark expand="md" fixed="top">
            <NavbarBrand href="/">
                MRequesterr
            </NavbarBrand>
            <NavbarToggler onClick={function noRefCheck() { }} />
            <Collapse navbar>
                <Nav navbar>
                    <NavItem>
                        <Link href="/" passHref>
                            <NavLink>
                                Now Playing
                            </NavLink>
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link passHref href="/discover">
                            <NavLink>Discover</NavLink>
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link passHref href="/requests">
                            <NavLink>Requests</NavLink>
                        </Link>
                    </NavItem>
                </Nav>
                <div className="col-md-4 col-lg-3 align-self-center">
                    <Input type="search" placeholder="Search" onKeyUp={handleSearch} onChange={handleChange} value={searchText} />
                </div>
                <div className="navbar-nav position-absolute end-0">
                    <div className="nav-item text-nowrap">
                        <a className="nav-link px-3" href="#" onClick={handleLogout}>Sign out</a>
                    </div>
                </div>
            </Collapse>
        </Navbar>)
};

export default NavMenu;
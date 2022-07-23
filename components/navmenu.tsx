import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEventHandler, KeyboardEventHandler, useState } from "react";
import { Collapse, DropdownItem, DropdownMenu, DropdownToggle, Input, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, UncontrolledDropdown } from "reactstrap";
import { useRecoilState } from "recoil";
import { authState } from "../states/auth";

const NavMenu = () => {
    const router = useRouter();
    const [searchText, setSearchText] = useState<string>("");
    const [userState, setUserState] = useRecoilState(authState);
    const [isNavBarOpen, setIsNavBarOpen] = useState<boolean>(false);

    const handleSearch: KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.code === 'Enter') {
            router.push(`/search/${searchText}`)
        }
    }

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setSearchText(event.currentTarget.value);
    }

    const handleLogout = () => {
        localStorage.removeItem("authStateToken");
        setUserState({});
    }

    const handleToggler = () => {
        setIsNavBarOpen(!isNavBarOpen);
    }

    return (
        <Navbar color="primary" dark expand="md" fixed="top">
            <NavbarBrand href="/">
                MRequesterr
            </NavbarBrand>
            <NavbarToggler onClick={handleToggler} />
            {userState?.AccessToken && (
                <Collapse navbar isOpen={isNavBarOpen}>
                    <Nav navbar>
                        <NavItem>
                            <Link href="/" passHref>
                                <NavLink>
                                    Now Playing
                                </NavLink>
                            </Link>
                        </NavItem>
                        <UncontrolledDropdown inNavbar nav>
                            <DropdownToggle caret nav>
                                Discover
                            </DropdownToggle>
                            <DropdownMenu end>
                                <Link passHref href="/discoverMovie/1">
                                    <DropdownItem >
                                        Popular Movies
                                    </DropdownItem>
                                </Link>
                                <Link passHref href="/discoverSeries/1">
                                    <DropdownItem>
                                        Popular Series
                                    </DropdownItem>
                                </Link>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <NavItem>
                            <Link passHref href="/requests">
                                <NavLink>Requests</NavLink>
                            </Link>
                        </NavItem>
                        <UncontrolledDropdown inNavbar nav>
                            <DropdownToggle caret nav>
                                Release Calendar
                            </DropdownToggle>
                            <DropdownMenu end>
                                <Link passHref href="/calendar/movie">
                                    <DropdownItem >
                                        Movies
                                    </DropdownItem>
                                </Link>
                                <Link passHref href="/calendar/tv">
                                    <DropdownItem>
                                        Series
                                    </DropdownItem>
                                </Link>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                    <div className="col-md-4 col-lg-3 align-self-center">
                        <Input type="search" placeholder="Search" onKeyUp={handleSearch} onChange={handleChange} value={searchText} />
                    </div>
                    <div className="navbar-nav position-absolute end-0 d-none d-sm-none d-md-block">
                        <div className="nav-item text-nowrap">
                            <a className="nav-link px-3" href="#" onClick={handleLogout}>Sign out</a>
                        </div>
                    </div>
                    <div className="navbar-nav d-block d-sm-block d-md-none">
                        <div className="nav-item text-nowrap">
                            <a className="nav-link px-3" href="#" onClick={handleLogout}>Sign out</a>
                        </div>
                    </div>
                </Collapse>)}
        </Navbar>)
};

export default NavMenu;
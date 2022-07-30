import { Box, AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem, Drawer, Divider, ListItem, ListItemButton, ListItemText, List } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEventHandler, KeyboardEventHandler, useState } from "react";
import React from "react";
import { useRecoilState } from "recoil";
import { authState } from "../states/auth";
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

const NavMenu = () => {
    const router = useRouter();
    const [searchText, setSearchText] = useState<string>("");
    const [userState, setUserState] = useRecoilState(authState);

    const [mobileOpen, setMobileOpen] = React.useState(false);

    const [discoverAnchorEl, setDiscoverAnchorEl] = React.useState<null | HTMLElement>(null);
    const discoverOpen = Boolean(discoverAnchorEl);

    const handleDiscoverClick = (event: React.MouseEvent<HTMLElement>) => {
        setDiscoverAnchorEl(event.currentTarget);
    };
    const handleDiscoverClose = () => {
        setDiscoverAnchorEl(null);
    };

    const [calendarAnchorEl, setCalendarAnchorEl] = React.useState<null | HTMLElement>(null);
    const calendarOpen = Boolean(calendarAnchorEl);

    const handleCalendarClick = (event: React.MouseEvent<HTMLElement>) => {
        setCalendarAnchorEl(event.currentTarget);
    };
    const handleCalendarClose = () => {
        setCalendarAnchorEl(null);
    };

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

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const navItems = [{"name": 'Now Playing', "link": "/" }, {"name": 'Popular Movies', "link": "/discoverMovie/1" }, {"name": 'Popular Series', "link": "/discoverSeries/1" },
        {"name": 'Request', "link": "/requests" }, {"name": 'Movies Calendar', "link": "/calendar/movie" }, {"name": 'Series Calendar', "link": "/calendar/tv" }, 
        {"name": 'Logout', "action": handleLogout }
    ];

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                MRequesterr
            </Typography>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.name} disablePadding>
                        <ListItemButton sx={{ textAlign: 'center' }}>
                            {item.action && <ListItemText primary={item.name} onClick={item.action} />}
                            {!item.action && <ListItemText primary={item.name} onClick={() => {router.push(item.link)}} />}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <React.Fragment>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="fixed">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{ mr: 2, display: { sm: 'none' } }}
                            onClick={handleDrawerToggle}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                        >
                            MRequesterr
                        </Typography>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Link href="/" passHref>
                                <Button sx={{ color: '#fff' }}>
                                    Now Playing
                                </Button>
                            </Link>
                            <Button sx={{ color: '#fff' }} onClick={handleDiscoverClick}
                                aria-controls={discoverOpen ? 'discover-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={discoverOpen ? 'true' : undefined}
                                endIcon={<KeyboardArrowDownIcon />}>
                                Discover
                            </Button>
                            <Link href="/requests" passHref>
                                <Button sx={{ color: '#fff' }}>
                                    Requests
                                </Button>
                            </Link>
                            <Button sx={{ color: '#fff' }} onClick={handleCalendarClick}
                                aria-controls={calendarOpen ? 'calendar-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={calendarOpen ? 'true' : undefined}
                                endIcon={<KeyboardArrowDownIcon />}>
                                Release Calendar
                            </Button>
                        </Box>
                        <Box component="nav">
                            <Drawer
                                variant="temporary"
                                open={mobileOpen}
                                onClose={handleDrawerToggle}
                                ModalProps={{
                                    keepMounted: true, // Better open performance on mobile.
                                }}
                                sx={{
                                    display: { xs: 'block', sm: 'none' },
                                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                                }}
                            >
                                {drawer}
                            </Drawer>
                        </Box>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search…"
                                inputProps={{ 'aria-label': 'search' }}
                                onKeyDown={handleSearch}
                                onChange={handleChange}
                            />
                        </Search>
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Button sx={{ color: '#fff' }} onClick={handleLogout}>
                                Sign Out
                            </Button>
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>
            <Menu
                anchorEl={discoverAnchorEl}
                id="discover-menu"
                open={discoverOpen}
                onClose={handleDiscoverClose}
                onClick={handleDiscoverClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Link href="/discoverMovie/1" passHref>
                    <MenuItem>
                        Popular Movies
                    </MenuItem>
                </Link>
                <Link href="/discoverSeries/1" passHref>
                    <MenuItem>
                        Popular Series
                    </MenuItem>
                </Link>
            </Menu>
            <Menu
                anchorEl={calendarAnchorEl}
                id="calendar-menu"
                open={calendarOpen}
                onClose={handleCalendarClose}
                onClick={handleCalendarClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Link href="/calendar/movie" passHref>
                    <MenuItem>
                        Movies
                    </MenuItem>
                </Link>
                <Link href="/calendar/tv" passHref>
                    <MenuItem>
                        Series
                    </MenuItem>
                </Link>
            </Menu>
        </React.Fragment>
    )
};

export default NavMenu;
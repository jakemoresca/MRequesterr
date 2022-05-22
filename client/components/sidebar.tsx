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
            <NavLink href="/" className="nav-link">Discover</NavLink>
        </NavItem>
        <NavItem className="nav-item">
            <Link passHref href="/requests">
                <NavLink className="nav-link">Requests</NavLink>
            </Link>
        </NavItem>
    </Nav>

    //     <div className="flex-shrink-0 p-3 bg-white" style={{width: 210}}>
    //     <ul className="list-unstyled ps-0">
    //         <li className="mb-1">
    //             <Button className="btn btn-toggle align-items-center rounded" aria-expanded={false}>Home</Button>
    //             <div className={`collapse ${'show'}`} id="home-collapse">
    //                 <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
    //                     <li><a href="/" className="link-dark rounded">Now Playing</a></li>
    //                     <li><a href="#" className="link-dark rounded">Discover</a></li>
    //                     <li><a href="/requests" className="link-dark rounded">Requests</a></li>
    //                 </ul>
    //             </div>
    //         </li>
    //         {/* <li className="mb-1">
    //             <Button className="btn btn-toggle align-items-center rounded" aria-expanded={false}>Settings</Button>
    //             <div className={`collapse ${'show'}`} id="home-collapse">
    //                 <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
    //                     <li><a href="/movies" className="link-dark rounded">Movies</a></li>
    //                     <li><a href="/series" className="link-dark rounded">Series</a></li>
    //                 </ul>
    //             </div>
    //         </li> */}
    //         <li className="border-top my-3"></li>
    //         <li className="mb-1">
    //             <Button className="btn btn-toggle align-items-center rounded" aria-expanded={false}>Account</Button>
    //             <div className={`collapse ${'show'}`} id="home-collapse">
    //                 <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
    //                     <li><a href="#" className="link-dark rounded">New...</a></li>
    //                     <li><a href="#" className="link-dark rounded">Profile</a></li>
    //                     <li><a href="#" className="link-dark rounded">Settings</a></li>
    //                     <li><a href="#" className="link-dark rounded">Sign out</a></li>
    //                 </ul>
    //             </div>
    //         </li>
    //     </ul>
    // </div>
);

export default Sidebar;
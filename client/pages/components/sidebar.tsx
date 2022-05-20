import { Button } from "reactstrap";

const Sidebar = () => (
    <div className="flex-shrink-0 p-3 bg-white" style={{width: 280}}>
    <ul className="list-unstyled ps-0">
        <li className="mb-1">
            <Button className="btn btn-toggle align-items-center rounded" aria-expanded={false}>Home</Button>
            <div className={`collapse ${'show'}`} id="home-collapse">
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    <li><a href="#" className="link-dark rounded">Now Playing</a></li>
                    <li><a href="#" className="link-dark rounded">Discover</a></li>
                    <li><a href="#" className="link-dark rounded">Requests</a></li>
                </ul>
            </div>
        </li>
        <li className="mb-1">
            <Button className="btn btn-toggle align-items-center rounded" aria-expanded={false}>Settings</Button>
            <div className={`collapse ${'show'}`} id="home-collapse">
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    <li><a href="settings/movie" className="link-dark rounded">Movies</a></li>
                    <li><a href="settings/series" className="link-dark rounded">Series</a></li>
                </ul>
            </div>
        </li>
        <li className="border-top my-3"></li>
        <li className="mb-1">
            <Button className="btn btn-toggle align-items-center rounded" aria-expanded={false}>Account</Button>
            <div className={`collapse ${'show'}`} id="home-collapse">
                <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                    <li><a href="#" className="link-dark rounded">New...</a></li>
                    <li><a href="#" className="link-dark rounded">Profile</a></li>
                    <li><a href="#" className="link-dark rounded">Settings</a></li>
                    <li><a href="#" className="link-dark rounded">Sign out</a></li>
                </ul>
            </div>
        </li>
    </ul>
</div>
);

export default Sidebar;
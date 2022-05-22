const NavMenu = () => (
    <header className="navbar navbar-expand-lg navbar-dark sticky-top bg-primary flex-md-nowrap p-0 shadow mh-100">
        <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">
            <svg className="bi me-2" width="30" height="24" style={{'fill': 'white'}}><use xlinkHref="#bootstrap"></use></svg>
            <span className="fs-5 fw-semibold">MRequesterr</span>
        </a>
        <input className="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search" />
        <div className="navbar-nav">
            <div className="nav-item text-nowrap">
            <a className="nav-link px-3" href="#">Sign out</a>
            </div>
        </div>
    </header>
);

export default NavMenu;
import { useRouter } from "next/router";
import { ChangeEventHandler, KeyboardEventHandler, useState } from "react";
import { Input } from "reactstrap";

const NavMenu = () => {
    const router = useRouter();
    const [searchText, setSearchText] = useState<string>("");

    const handleSearch: KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.code === 'Enter') {
            router.push(`/search/${searchText}`)
        }
    }

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setSearchText(event.currentTarget.value);
    }

    return (<header className="navbar navbar-expand-lg navbar-dark sticky-top bg-primary flex-md-nowrap p-0 shadow mh-100">
        <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">
            <svg className="bi me-2" width="30" height="24" style={{ 'fill': 'white' }}><use xlinkHref="#bootstrap"></use></svg>
            <span className="fs-5 fw-semibold">MRequesterr</span>
        </a>
        <Input type="search" placeholder="Search" onKeyUp={handleSearch} onChange={handleChange} value={searchText} />
        {/* <input className="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search" /> */}
        <div className="navbar-nav">
            <div className="nav-item text-nowrap">
                <a className="nav-link px-3" href="#">Sign out</a>
            </div>
        </div>
    </header>)
};

export default NavMenu;
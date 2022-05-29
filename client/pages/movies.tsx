import Authenticate from "../components/authenticate";

const Movies = () => {
    return (<div>
        <Authenticate>
            <nav className="navbar bg-light ml-n1">
                <div className="container-fluid justify-content-start">
                    <div className="col-md-9">
                        <button type="button" className="btn btn-outline-primary">Save</button>
                        <button type="button" className="btn btn-outline-primary">Test Settings</button>
                    </div>
                </div>
            </nav>

            <div className="album py-5 bg-light">
                <div className="container">
                    <h2>Movies Settings</h2>

                    <div className="alert alert-success d-flex align-items-center" role="alert">
                        <i className="bi bi-check2"></i>
                        <div>
                            Settings was saved succesfully
                        </div>
                    </div>

                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                        <i className="bi bi-exclamation-diamond-fill"></i>
                        <div>
                            Cannot connect to Radarr using the settings provided
                        </div>
                    </div>

                    <div className="alert alert-success d-flex align-items-center" role="alert">
                        <i className="bi bi-check2"></i>
                        <div>
                            Connection to Radarr has been established
                        </div>
                    </div>

                    <hr />

                    <h5>Radarr Integration</h5>

                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="baseUrl" />
                        <label htmlFor="baseUrl">Base Url</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="apiKey" />
                        <label htmlFor="apiKey">Api Key</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="host" />
                        <label htmlFor="host">Host</label>
                    </div>
                    <div className="form-floating mb-3">
                        <input type="number" className="form-control" id="port" min="1" maxLength={5} />
                        <label htmlFor="port">Port</label>
                    </div>
                    <div className="form-check mb-3">
                        <input className="form-check-input" type="checkbox" value="" id="useSsl" />
                        <label className="form-check-label" htmlFor="useSsl">
                            Use SSL
                        </label>
                    </div>

                </div>
            </div>
        </Authenticate>
    </div>);
};

export default Movies;
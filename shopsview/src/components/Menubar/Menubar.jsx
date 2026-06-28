import React from 'react';

const Menubar = ({ toggleSidebar, shopId, onLogout }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
            <div className="container-fluid">
                <button className="btn btn-primary shadow-none" id="sidebarToggle" onClick={toggleSidebar}>
                    <i className="bi bi-list"></i>
                </button>

                {/* Visual Active Account Label */}
                <span className="ms-3 fw-bold text-dark">
                  Shop Partner: <span className="badge bg-dark text-uppercase ms-1">{shopId}</span>
                </span>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"><span className="navbar-toggler-icon"></span></button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ms-auto mt-2 mt-lg-0 align-items-lg-center">
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle fw-semibold" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown">Options</a>
                            <div className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                                <button className="dropdown-item text-danger fw-bold" onClick={onLogout}>
                                    <i className="bi bi-box-arrow-right me-2"></i>Logout Shop
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Menubar;
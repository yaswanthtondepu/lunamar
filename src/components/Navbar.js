import React from "react";
import '../css/styles.css';
import { Link } from "react-router-dom";
const Navbar = () => {
    let currentUser;
    if (window.sessionStorage.getItem("userDetails")) {
        currentUser = JSON.parse(window.sessionStorage.getItem("userDetails"));
    }

    let currentRole;
    if (currentUser) {
        currentRole = currentUser.role
    }
    else {
        currentRole = null;
    }

    function openMenu() {
        if (document.getElementsByClassName("nav-menu")[0].style.left === '-100%') {
            document.getElementsByClassName("nav-menu")[0].style.left = 0;
        }
        else {
            document.getElementsByClassName("nav-menu")[0].style.left = '-100%';
        }

    }

    function closeMenu() {

    }

    function logOut() {
        window.sessionStorage.setItem("userDetails", null);
    }
    return (
        <header className="header">
            <nav className="navbar">
                <Link to="/home" className="nav-logo">Lunamar</Link>
                <ul className="nav-menu">
                    <li className="nav-item">
                        <Link to="/home" className="nav-link" onClick={closeMenu}>Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/about" className="nav-link" onClick={closeMenu}>About</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/services" className="nav-link" onClick={closeMenu}>Services</Link>
                    </li>
                    <li className="nav-item">
                        {/* <Link to="https://lunamar1blog.wordpress.com/" className="nav-link" >Blog</Link> */}
                        <a href="https://vxt9613.uta.cloud/blog" className="nav-link" >Blog</a>
                    </li>
                    <li className="nav-item">
                        <Link to="/contact" className="nav-link" onClick={closeMenu}>Contact</Link>

                    </li>
                    <li className="nav-item">
                        <Link to="/gallery" className="nav-link" onClick={closeMenu}>Gallery</Link>

                    </li>
                    <li className="nav-item" style={currentRole ? { display: 'none' } : { display: 'block' }}>
                        <Link to="/login" className="nav-link" onClick={closeMenu}>Login/Register</Link>
                    </li>
                    <li className="nav-item" style={currentRole ? { display: 'block' } : { display: 'none' }}>
                        <div className="nav-dropdown" id="nav-dropdown">
                            <div className="role-title">
                                {currentRole ? currentRole : ''}
                                <img alt="caret" src="../assets/images/caret-down-icon.jpg" className="caret-down" />
                            </div>
                            <div className="dropdown-content">
                                <Link to={currentRole ? "/" + currentRole : ''} className="nav-link" onClick={closeMenu}>{currentRole ? currentRole : ''} View</Link>
                                <Link to="/login" className="nav-link" onClick={logOut}>Logout</Link>
                            </div>
                        </div>
                    </li>
                    {/* <li className="nav-item" style={{ display: "none" }}>
                        <div className="nav-dropdown" id="nav-dropdown">
                            <div className="role-title">
                                Manager
                                <img src="../assets/images/caret-down-icon.jpg" className="caret-down" />
                            </div>
                            <div className="dropdown-content">
                                <Link to="/manager" className="nav-link" onClick={closeMenu}>Manager View</Link>
                                <Link to="/login" className="nav-link" onClick={logOut}>Logout</Link>
                            </div>
                        </div>
                    </li>
                    <li className="nav-item" style={{ display: "none" }}>
                        <div className="nav-dropdown" id="nav-dropdown">
                            <div className="role-title">
                                Admin
                                <img src="../assets/images/caret-down-icon.jpg" className="caret-down" />
                            </div>
                            <div className="dropdown-content">
                                <Link to="/admin" className="nav-link" onClick={closeMenu}>Admin View</Link>
                                <Link to="/login" className="nav-link" onClick={logOut}>Logout</Link>
                            </div>
                        </div>
                    </li>
                    <li className="nav-item" style={{ display: "none" }}>
                        <div className="nav-dropdown" id="nav-dropdown">
                            <div className="role-title">
                                Visitor
                                <img src="../assets/images/caret-down-icon.jpg" className="caret-down" />
                            </div>
                            <div className="dropdown-content">
                                <Link to="/visitor" className="nav-link" onClick={closeMenu}>Visitor View</Link>
                                <Link to="/login" className="nav-link" onClick={logOut}>Logout</Link>
                            </div>
                        </div>
                    </li> */}
                </ul>
                <div className="hamburger" onClick={openMenu}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>
            </nav>
        </header>
    )
};

export default Navbar;
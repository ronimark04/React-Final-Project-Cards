import { useContext, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LogoutModal from "./LogoutModal";
import { getUserById } from "../services/userService";
import navbarLogo from "../assets/navbarLogo.png";
import { SiteTheme } from "../App";
import "./style/Navbar.css";

function Navbar({ setSearchQuery, user, setUser, darkmode, setDarkmode }) {
    const [openLogoutModal, setOpenLogoutModal] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const location = useLocation();
    const [profileImg, setProfileImg] = useState({});
    const navigate = useNavigate();

    if (user) {
        getUserById(user._id).then((res) => {
            setProfileImg({ url: res.data.image.url, alt: res.data.image.alt });
        }).catch((err) => {
            console.log(err);
        });
    };

    useEffect(() => {
        setSearchInput("");
        setSearchQuery("");
    }, [location, setSearchQuery]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);
        setSearchQuery(value);
    };

    const requestRender = () => {
        setUser(null);
    };

    const themes = useContext(SiteTheme);

    return (<>
        <nav
            className="navbar"
            style={{
                backgroundColor: themes.navbar.bgColor,
                color: themes.navbar.textColor,
            }}
        >
            <div className="navbar-container">
                <img
                    src={navbarLogo}
                    alt="Logo"
                    className="navbar-logo"
                    onClick={() => navigate("/home")}
                />
                <div className="navbar-links-dropdown">
                    <NavLink to="/about">About</NavLink>
                    {user && <NavLink to="/profile">Profile</NavLink>}
                    {user && <NavLink to="/fav-cards">Fav Cards</NavLink>}
                    {user && user.isBusiness && (
                        <NavLink to="/my-cards">My Cards</NavLink>
                    )}
                </div>
                <div className="navbar-links">
                    <NavLink to="/home">Home</NavLink>
                    <NavLink to="/about">About</NavLink>
                    {user && <NavLink to="/profile">Profile</NavLink>}
                    {user && <NavLink to="/fav-cards">Fav Cards</NavLink>}
                    {user && user.isBusiness && (
                        <NavLink to="/my-cards">My Cards</NavLink>
                    )}
                </div>
                <div className="navbar-controls">
                    <input
                        type="search"
                        className="search-bar"
                        placeholder="Search"
                        value={searchInput}
                        onChange={handleSearchChange}
                        style={{
                            backgroundColor: themes.navbar.searchBar.bgColor,
                            color: themes.navbar.searchBar.textColor,
                            borderColor: themes.navbar.searchBar.borderColor,
                        }}
                    />
                    <i
                        className={`fa-solid ${darkmode ? "fa-sun" : "fa-moon"
                            } darkmode-toggle`}
                        onClick={() => setDarkmode(!darkmode)}
                        style={{ color: themes.navbar.darkmodeToggleColor }}
                    ></i>
                    {user ? (
                        <NavLink to="/profile">
                            <img
                                src={profileImg.url}
                                alt={profileImg.alt}
                                className="profile-img"
                            />
                        </NavLink>
                    ) : (
                        <div className="auth-links">
                            <NavLink to="/register">Sign Up</NavLink>
                            <NavLink to="/login">Login</NavLink>
                        </div>
                    )}
                    {user && (<div className="auth-links">
                        <NavLink
                            to="#"
                            onClick={() => setOpenLogoutModal(true)}
                        >
                            Logout
                        </NavLink>
                    </div>
                    )}
                </div>
            </div>
        </nav>
        <LogoutModal show={openLogoutModal} onHide={() => { setOpenLogoutModal(false) }} requestRender={requestRender} />
    </>
    );



}

export default Navbar;

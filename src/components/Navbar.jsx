import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LogoutModal from "./LogoutModal";
import { getUserById } from "../services/userService";
import navbarLogo from "../assets/navbarLogo.png";

function Navbar({ setSearchQuery, user, setUser, darkmode, setDarkmode }) {
    const [openLogoutModal, setOpenLogoutModal] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const location = useLocation();
    const [profileImg, setProfileImg] = useState({});

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

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid d-flex align-items-center">
                    <img src={navbarLogo} alt="Logo" style={{ height: "40px" }} />
                    <div className="d-flex me-auto">
                        <NavLink className="me-4" to="/home">Home</NavLink>
                        <NavLink className="me-4" to="/about">About</NavLink>
                        {user && <NavLink className="me-4" to="/profile">Profile</NavLink>}
                        {user && <NavLink className="me-4" to="/fav-cards">Fav Cards</NavLink>}
                        {user && user.isBusiness && <NavLink className="me-4" to="/my-cards">My Cards</NavLink>}
                    </div>

                    <div className="d-flex align-items-center">
                        <div className="d-flex me-4">
                            <input
                                className="form-control me-2"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                                value={searchInput}
                                onChange={handleSearchChange}
                            />
                        </div>

                        {darkmode ? (<i
                            className="fa-solid fa-sun"
                            onClick={() => {
                                setDarkmode(!darkmode)
                            }}
                            style={{ cursor: "pointer" }}
                        ></i>) :
                            (<i
                                className="fa-solid fa-moon"
                                onClick={() => {
                                    setDarkmode(!darkmode)

                                }}
                                style={{ cursor: "pointer" }} ></i>)}

                        {user && <NavLink className="me-4" to="/profile"><img src={profileImg.url} alt={profileImg.alt} style={{ height: "40px", borderRadius: "50%" }} /></NavLink>}
                        {!user && <NavLink className="me-4" to="/register">Sign Up</NavLink>}
                        {!user && <NavLink className="me-4" to="/login">Login</NavLink>}
                        {user && <NavLink className="me-4" onClick={() => { setOpenLogoutModal(true) }}>Logout</NavLink>}
                    </div>
                </div>
            </nav>
            <LogoutModal show={openLogoutModal} onHide={() => { setOpenLogoutModal(false) }} requestRender={requestRender} />
        </>
    );

}

export default Navbar;

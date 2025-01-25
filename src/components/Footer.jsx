import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteTheme } from "../App";
import "./style/Footer.css";

function Footer({ user }) {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    const themes = useContext(SiteTheme);

    return (
        <footer
            className="footer"
            style={{
                backgroundColor: themes.footer.bgColor,
                color: themes.footer.textColor,
            }}
        >
            <div className="footer-container">
                <a
                    onClick={() => handleNavigate("/about")}
                    className="footer-link"
                    style={{
                        color: themes.footer.textColor,
                    }}
                >
                    <i
                        className="fa-solid fa-circle-info"
                        style={{
                            color: themes.footer.iconColor,
                        }}
                    ></i>
                    <p>About</p>
                </a>
                {user && (
                    <a
                        onClick={() => handleNavigate("/fav-cards")}
                        className="footer-link"
                        style={{
                            color: themes.footer.textColor,
                        }}
                    >
                        <i
                            className="fa-solid fa-heart"
                            style={{
                                color: themes.footer.iconColor,
                            }}
                        ></i>
                        <p>Favorites</p>
                    </a>
                )}
                {user && user.isBusiness && (
                    <a
                        onClick={() => handleNavigate("/my-cards")}
                        className="footer-link"
                        style={{
                            color: themes.footer.textColor,
                        }}
                    >
                        <i
                            className="fa-solid fa-circle-user"
                            style={{
                                color: themes.footer.iconColor,
                            }}
                        ></i>
                        <p>My Cards</p>
                    </a>
                )}
            </div>
        </footer>
    );
}

export default Footer;
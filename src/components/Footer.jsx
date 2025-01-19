import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Footer({ user }) {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <footer className="text-center bg-body-tertiary">
            <div className="container pt-4">
                <section className="mb-4">
                    <a
                        data-mdb-ripple-init
                        className="btn btn-link btn-floating btn-lg text-body m-1"
                        onClick={() => { handleNavigate("/about") }}
                        role="button"
                        data-mdb-ripple-color="dark"
                        style={{ textDecoration: "none" }}
                    >
                        <i className="fa-solid fa-circle-info"></i>
                        <p>About</p>
                    </a>
                    {user && (
                        <a
                            data-mdb-ripple-init
                            className="btn btn-link btn-floating btn-lg text-body m-1"
                            onClick={() => { handleNavigate("/fav-cards") }}
                            role="button"
                            data-mdb-ripple-color="dark"
                            style={{ textDecoration: "none" }}
                        >
                            <i className="fa-solid fa-heart"></i>
                            <p>Favorites</p>
                        </a>
                    )}
                    {user && user.isBusiness && (
                        <a
                            data-mdb-ripple-init
                            className="btn btn-link btn-floating btn-lg text-body m-1"
                            onClick={() => { handleNavigate("/my-cards") }}
                            role="button"
                            data-mdb-ripple-color="dark"
                            style={{ textDecoration: "none" }}
                        >
                            <i className="fa-solid fa-circle-user"></i>
                            <p>My Cards</p>
                        </a>
                    )}


                </section>
            </div>
        </footer >
    );
}

export default Footer;
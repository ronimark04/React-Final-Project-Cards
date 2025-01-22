import { useContext, useEffect, useState } from "react";
import { getAllCards, toggleLike } from "../services/cardsService";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import usePagination from "../../customHooks/usePagination";
import { SiteTheme } from "../App";
import "./style/Home.css";

function FavCards({ searchQuery }) {
    const [cards, setCards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState();
    const [cardsChanged, setCardsChanged] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            setUser(jwtDecode(localStorage.getItem("token")));
        }
    }, []);

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            getAllCards()
                .then((res) => {
                    const likedCards = res.data.filter((card) => card.likes.includes(user._id));
                    setCards(likedCards);
                })
                .catch((err) => console.error(err))
                .finally(() => setIsLoading(false));
        }
    }, [user, cardsChanged]);

    const requestRender = () => {
        setCardsChanged(!cardsChanged);
    };

    const handleToggleLike = (card) => {
        if (!user) return;

        toggleLike(card._id, user._id)
            .then(() => {
                if (card.likes.includes(user._id)) {
                    setCards((prevCards) => prevCards.filter((c) => c._id !== card._id));
                } else {
                    requestRender();
                }
            })
            .catch((err) => console.error(err));
    };

    const filteredCards = cards.filter((card) =>
        card.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const {
        currentItems: currentCards,
        currentPage,
        pageNumbers,
        pageGroup,
        totalPageGroups,
        handlePageClick,
        handleNextPageGroup,
        handlePreviousPageGroup,
    } = usePagination(filteredCards);

    const themes = useContext(SiteTheme);

    return (
        <div className="home-container">
            <h1 className="home-title" style={{ marginBottom: "20px", color: themes.page.textColor }}>Favorite Cards</h1>
            {isLoading ? (
                <div className="spinner-container">
                    <div className="spinner"></div>
                </div>
            ) : (
                <>
                    {currentCards.length > 0 ? (
                        <div className="card-grid">
                            {currentCards.map((card) => (
                                <div className="card" key={card._id} style={{
                                    backgroundColor: themes.card.bgColor,
                                    color: themes.card.textColor
                                }}>
                                    <img
                                        className="card-img"
                                        src={card.image.url}
                                        alt={card.image.alt}
                                    />
                                    <div className="card-body">
                                        <h4 className="card-title">{card.title}</h4>
                                        <h6 className="card-subtitle">{card.subtitle}</h6>
                                        <p className="card-text">{card.phone}</p>
                                        <p className="card-text">
                                            {card.address.country}, {card.address.city},{" "}
                                            {card.address.street} {card.address.houseNumber}
                                        </p>
                                        <p className="card-text">{card.email}</p>
                                        <div className="card-icons">
                                            <div
                                                className="like-icon"
                                                onClick={() => handleToggleLike(card)}
                                            >
                                                {user && card.likes.includes(user._id) ? (
                                                    <i className="fa-solid fa-heart text-danger"></i>
                                                ) : (
                                                    <i className="fa-regular fa-heart"></i>
                                                )}
                                                <p>{card.likes.length}</p>
                                            </div>
                                            <a href={`tel:${card.phone}`} className="phone-icon">
                                                <i className="fa-solid fa-phone"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-cards-message">No favorite cards found</p>
                    )}
                    <div className="pagination-controls">
                        <button
                            className="pagination-button"
                            disabled={pageGroup === 1}
                            onClick={handlePreviousPageGroup}
                            style={{ color: themes.page.textColor }}
                        >
                            &laquo;
                        </button>
                        {pageNumbers.map((number) => (
                            <button
                                key={number}
                                className={`pagination-number ${currentPage === number ? "active" : ""
                                    }`}
                                onClick={() => handlePageClick(number)}
                                style={{ color: themes.page.textColor }}
                            >
                                {number}
                            </button>
                        ))}
                        {pageGroup < totalPageGroups && (
                            <button
                                className="pagination-button"
                                onClick={handleNextPageGroup}
                                style={{ color: themes.page.textColor }}
                            >
                                ...
                            </button>
                        )}
                        <button
                            className="pagination-button"
                            disabled={pageGroup === totalPageGroups}
                            onClick={handleNextPageGroup}
                            style={{ color: themes.page.textColor }}
                        >
                            &raquo;
                        </button>
                    </div>
                </>
            )}
        </div>
    );

}

export default FavCards;
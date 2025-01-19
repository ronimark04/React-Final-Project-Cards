import { useEffect, useState } from "react";
import { getAllCards, toggleLike } from "../services/cardsService";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import usePagination from "../../customHooks/usePagination";

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

    return (
        <div className="container mt-4">
            <h1>Favorite Cards</h1>

            {isLoading ? (
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            ) : (
                <>
                    {currentCards.length > 0 ? (
                        <div className="row">
                            {currentCards.map((card) => (
                                <div className="col-md-4 col-sm-6 mb-4" key={card._id}>
                                    <div className="card" style={{ width: "100%" }}>
                                        <Link to={`/home/${card._id}`}><img
                                            className="card-img-top"
                                            src={card.image.url}
                                            alt={card.image.alt}
                                            style={{ height: "200px", objectFit: "cover" }}
                                        /></Link>
                                        <div className="card-body">
                                            <Link to={`/home/${card._id}`}><h4 className="card-title">{card.title}</h4></Link>
                                            <h6 className="card-title">{card.subtitle}</h6>
                                            <p className="card-text">{card.phone}</p>
                                            <p className="card-text">
                                                {card.address.country}, {card.address.city},{" "}
                                                {card.address.street} {card.address.houseNumber}
                                            </p>
                                            <p className="card-text">{card.email}</p>
                                            <div
                                                className="d-flex justify-content-between align-items-center mt-3"
                                                style={{ width: "100%" }}
                                            >
                                                <div
                                                    style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}
                                                    onClick={() => handleToggleLike(card)}
                                                >
                                                    {user && card.likes.includes(user._id) ? (
                                                        <i className="fa-solid fa-heart text-danger"></i>
                                                    ) : (
                                                        <i className="fa-regular fa-heart"></i>
                                                    )}
                                                    <span>{card.likes?.length || 0}</span>
                                                </div>
                                                <a href={`tel:${card.phone}`}>
                                                    <i className="fa-solid fa-phone" style={{ fontSize: "1.2rem", color: "#007bff", cursor: "pointer" }}></i>
                                                </a>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No favorite cards found</p>
                    )}

                    <div className="pagination-controls mt-4 d-flex justify-content-center align-items-center">
                        <button
                            className="btn btn-primary me-2"
                            disabled={pageGroup === 1}
                            onClick={handlePreviousPageGroup}
                        >
                            &laquo;
                        </button>

                        {pageNumbers.map((number) => (
                            <button
                                key={number}
                                className={`btn mx-1 ${currentPage === number ? "btn-primary" : "btn-outline-primary"
                                    }`}
                                onClick={() => handlePageClick(number)}
                            >
                                {number}
                            </button>
                        ))}

                        {pageGroup < totalPageGroups && (
                            <button
                                className="btn btn-outline-primary mx-1"
                                onClick={handleNextPageGroup}
                            >
                                ...
                            </button>
                        )}

                        <button
                            className="btn btn-primary ms-2"
                            disabled={pageGroup === totalPageGroups}
                            onClick={handleNextPageGroup}
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
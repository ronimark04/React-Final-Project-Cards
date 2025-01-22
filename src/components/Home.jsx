import { useContext, useEffect, useState } from "react";
import { getAllCards, toggleLike } from "../services/cardsService";
import { jwtDecode } from "jwt-decode";
import DeleteCardModal from "./deleteCardModal";
import UpdateCardModal from "./updateCardModal";
import { Link } from "react-router-dom";
import usePagination from "../../customHooks/usePagination";
import { SiteTheme } from "../App";
import "./style/Home.css";
import { toast } from "react-toastify";

function Home({ searchQuery }) {
    const [cards, setCards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState();
    const [cardId, setCardId] = useState("");
    const [bizNumber, setBizNumber] = useState("");
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [cardsChanged, setCardsChanged] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            setUser(jwtDecode(localStorage.getItem("token")));
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);
        getAllCards()
            .then((res) => {
                setCards(res.data);
            })
            .catch((err) => console.error(err))
            .finally(() => {
                setIsLoading(false);
            });
    }, [cardsChanged]);

    const requestRender = () => {
        setCardsChanged(!cardsChanged);
    };

    const handleToggleLike = (card) => {
        if (!user) {
            toast("To like cards please log in to your account or sign up");
            return;
        }

        toggleLike(card._id, user._id)
            .then(() => {
                const updatedCards = cards.map((c) =>
                    c._id === card._id
                        ? {
                            ...c,
                            likes: c.likes.includes(user._id)
                                ? c.likes.filter((id) => id !== user._id)
                                : [...c.likes, user._id],
                        }
                        : c
                );
                setCards(updatedCards);
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
        <div
            className="home-container"
        >
            <h1 className="home-title" style={{ color: themes.page.textColor }}>Cards Page</h1>
            <h2 className="home-subtitle" style={{ color: themes.page.textColor }}>Here you can find business cards from all categories</h2>
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
                                    <Link to={`/home/${card._id}`}>
                                        <img
                                            className="card-img"
                                            src={card.image.url}
                                            alt={card.image.alt}
                                        />
                                    </Link>
                                    <div className="card-body">
                                        <Link to={`/home/${card._id}`}>
                                            <h4 className="card-title">{card.title}</h4>
                                        </Link>
                                        <h6 className="card-subtitle">{card.subtitle}</h6>
                                        <hr />
                                        <p className="card-text">
                                            Phone: {card.phone}
                                        </p>
                                        <p className="card-text">
                                            Address: {card.address.street} {card.address.houseNumber}, {card.address.city}, {card.address.country}
                                        </p>
                                        <p className="card-text">Card Number: {card.bizNumber}</p>
                                        <div className="card-icons">
                                            <div
                                                className="like-icon"
                                                onClick={() => handleToggleLike(card)}
                                            >
                                                <i
                                                    className={`fa-heart ${user && card.likes.includes(user._id)
                                                        ? "fa-solid liked"
                                                        : "fa-regular"
                                                        }`}
                                                ></i>
                                                <p>{card.likes.length}</p>
                                            </div>
                                            {user && user.isBusiness && card.user_id === user._id && (
                                                <>
                                                    <i
                                                        className="fa-solid fa-pencil"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => {
                                                            setOpenUpdateModal(true);
                                                            setCardId(card._id);
                                                        }}
                                                    ></i>
                                                    <i
                                                        className="fa-regular fa-trash-can"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => {
                                                            setOpenDeleteModal(true);
                                                            setCardId(card._id);
                                                            setBizNumber(card.bizNumber);
                                                        }}
                                                    ></i>
                                                </>
                                            )}
                                            <a href={`tel:${card.phone}`}>
                                                <i className="fa-solid fa-phone"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-cards-message">No cards found</p>
                    )}
                    <div className="pagination-controls" style={{ color: themes.card.textColor }}>
                        <button
                            className="pagination-button"
                            disabled={pageGroup === 1}
                            onClick={handlePreviousPageGroup}
                        >
                            &laquo;
                        </button>
                        {pageNumbers.map((number) => (
                            <button
                                key={number}
                                className={`pagination-number ${currentPage === number ? "active" : ""}`}
                                onClick={() => handlePageClick(number)}
                            >
                                {number}
                            </button>
                        ))}
                        {pageGroup < totalPageGroups && (
                            <button
                                className="pagination-button"
                                onClick={handleNextPageGroup}
                            >
                                ...
                            </button>
                        )}
                        <button
                            className="pagination-button"
                            disabled={pageGroup === totalPageGroups}
                            onClick={handleNextPageGroup}
                        >
                            &raquo;
                        </button>
                    </div>
                    <DeleteCardModal
                        show={openDeleteModal}
                        onHide={() => setOpenDeleteModal(false)}
                        requestRender={requestRender}
                        cardId={cardId}
                        bizNumber={bizNumber}
                    />
                    <UpdateCardModal
                        show={openUpdateModal}
                        onHide={() => setOpenUpdateModal(false)}
                        requestRender={requestRender}
                        cardId={cardId}
                    />
                </>
            )}
        </div>
    );
}

export default Home;
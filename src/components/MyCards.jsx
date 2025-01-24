import { useContext, useEffect, useState } from "react";
import { getAllCards, toggleLike } from "../services/cardsService";
import { jwtDecode } from "jwt-decode";
import DeleteCardModal from "./deleteCardModal";
import UpdateCardModal from "./updateCardModal";
import AddCardModal from "./AddCardModal";
import { Link } from "react-router-dom";
import usePagination from "../../customHooks/usePagination";
import { SiteTheme } from "../App";
import "./style/Home.css";

function MyCards({ searchQuery, user }) {
    const [cards, setCards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cardId, setCardId] = useState("");
    const [bizNumber, setBizNumber] = useState("");
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [cardsChanged, setCardsChanged] = useState(false);

    useEffect(() => {
        if (user) {
            setIsLoading(true);
            getAllCards()
                .then((res) => {
                    const myCards = res.data.filter((card) => card.user_id === user._id);
                    setCards(myCards);
                })
                .catch((err) => console.error(err))
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [user, cardsChanged]);

    const requestRender = () => {
        setCardsChanged(!cardsChanged);
    };

    const handleToggleLike = (card) => {
        if (!user) return;

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
        <div className="home-container">
            <h1 className="home-title" style={{ color: themes.page.textColor }}>My Cards</h1>
            <button className="btn" style={{ backgroundColor: themes.navbar.bgColor, color: themes.navbar.textColor }} onClick={() => setOpenAddModal(true)}>
                Create New Card
            </button>
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
                                }}><Link to={`/home/${card._id}`}>
                                        <img
                                            className="card-img"
                                            src={card.image.url}
                                            alt={card.image.alt}
                                        /></Link>
                                    <div className="card-body">
                                        <Link to={`/home/${card._id}`}><h4 className="card-title">{card.title}</h4></Link>
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
                                            <i
                                                className="fa-solid fa-pencil edit-icon"
                                                onClick={() => {
                                                    setOpenUpdateModal(true);
                                                    setCardId(card._id);
                                                }}
                                                style={{ cursor: "pointer" }}
                                            ></i>
                                            <i
                                                className="fa-regular fa-trash-can delete-icon"
                                                onClick={() => {
                                                    setOpenDeleteModal(true);
                                                    setCardId(card._id);
                                                    setBizNumber(card.bizNumber);
                                                }}
                                                style={{ cursor: "pointer" }}
                                            ></i>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-cards-message">You haven’t created any cards yet</p>
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
                    <AddCardModal
                        show={openAddModal}
                        onHide={() => setOpenAddModal(false)}
                        requestRender={requestRender}
                    />
                </>
            )}
        </div>
    );
}

export default MyCards;
import { useEffect, useState } from "react";
import { getAllCards, toggleLike } from "../services/cardsService";
import { jwtDecode } from "jwt-decode";
import DeleteCardModal from "./deleteCardModal";
import UpdateCardModal from "./updateCardModal";
import { Link } from "react-router-dom";
import usePagination from "../../customHooks/usePagination";

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
        if (!user) return; // TOASTIFY

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

    return (
        <div className="container mt-4">
            <h1>Cards Page</h1>
            <h2>Here you can find business cards from all categories</h2>
            {isLoading ? (
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            ) : (
                <>{currentCards.length > 0 ? (
                    <div className="row">
                        {currentCards.map((card) => (
                            <div className="col-md-4 col-sm-6 mb-4" key={card._id}>
                                <div className="card" style={{ width: "100%" }}>
                                    <Link to={`/home/${card._id}`}>
                                        <img
                                            className="card-img-top"
                                            src={card.image.url}
                                            alt={card.image.alt}
                                            style={{ height: "200px", objectFit: "cover" }} /></Link>
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
                                            className="icons"
                                            style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div
                                                style={{ display: "flex", flexDirection: "row", cursor: "pointer" }}
                                                onClick={() => handleToggleLike(card)}>
                                                {user && card.likes.includes(user._id) ? (
                                                    <i className="fa-solid fa-heart text-danger" style={{ cursor: "pointer" }}></i>
                                                ) : (
                                                    <i className="fa-regular fa-heart" style={{ cursor: "pointer" }}></i>
                                                )}
                                                <p>{card.likes.length}</p>
                                            </div>
                                            {user &&
                                                user.isBusiness &&
                                                card.user_id === user._id && (
                                                    <><i
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
                                            <a href={`tel:${card.phone}`}><i className="fa-solid fa-phone" style={{ cursor: "pointer" }}></i></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No cards found</p>
                )}
                    <div className="pagination-controls mt-4 d-flex justify-content-center align-items-center">
                        <button
                            className="btn btn-primary me-2"
                            disabled={pageGroup === 1}
                            onClick={handlePreviousPageGroup}>
                            &laquo;
                        </button>
                        {pageNumbers.map((number) => (
                            <button
                                key={number}
                                className={`btn mx-1 ${currentPage === number ? "btn-primary" : "btn-outline-primary"
                                    }`}
                                onClick={() => handlePageClick(number)}>
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
                            onClick={handleNextPageGroup}>
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
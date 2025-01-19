import { useEffect, useState } from "react";
import { getCardById, toggleLike } from "../services/cardsService";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useLoadScript } from "@react-google-maps/api";
import createGoogleMap from "../../customHooks/mapsAPI";


function CardPage() {
    let { cardId } = useParams();
    const [card, setCard] = useState(null);
    const [user, setUser] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (cardId) {
            setIsLoading(true);
            getCardById(cardId)
                .then((res) => {
                    setCard(res.data);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
        if (localStorage.getItem("token")) {
            setUser(jwtDecode(localStorage.getItem("token")));
        }
    }, [cardId]);

    //
    const [MapComponent, setMapComponent] = useState(null);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyDSQRxFvaJ7gBHl4viRz8_UtbHXDi9RVaA",
    });

    useEffect(() => {
        const fetchMap = async () => {
            if (card && card.address) {
                try {
                    const mapFn = await createGoogleMap(card.address, "YOUR_GOOGLE_MAPS_API_KEY");
                    setMapComponent(() => mapFn);
                } catch (error) {
                    console.error("Error creating map:", error);
                }
            }
        };

        fetchMap();
    }, [card]);

    if (!card) {
        return <div>Loading card data...</div>;
    }

    const handleToggleLike = () => {
        if (!user) {
            alert("To like cards please log in");
            return;
        }

        toggleLike(card._id, user._id)
            .then(() => {
                setCard((prevCard) => ({
                    ...prevCard,
                    likes: prevCard.likes.includes(user._id)
                        ? prevCard.likes.filter((id) => id !== user._id)
                        : [...prevCard.likes, user._id],
                }));
            })
            .catch((err) => console.error(err));
    };

    return (
        <>
            {isLoading ? (
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : card ? (
                <div className="container my-5">
                    <div className="card shadow">
                        <img
                            src={card.image?.url || "https://via.placeholder.com/150"}
                            className="card-img-top"
                            alt={card.image?.alt || "Default card image"}
                            style={{
                                maxWidth: "100%",
                                height: "auto",
                                objectFit: "cover",
                                maxHeight: "500px",
                            }}
                        />
                        <div className="card-body">
                            <h2 className="card-title">{card.title || "Untitled Card"}</h2>
                            <h4 className="card-subtitle mb-3 text-muted">{card.subtitle || "No subtitle available"}</h4>
                            <p className="card-text">{card.description || "No description available"}</p>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <strong>Phone:</strong> {card.phone || "N/A"}
                                </li>
                                <li className="list-group-item">
                                    <strong>Email:</strong> {card.email || "N/A"}
                                </li>
                                <li className="list-group-item">
                                    <strong>Website:</strong>{" "}
                                    {card.web ? (
                                        <a href={card.web} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                            {card.web}
                                        </a>
                                    ) : (
                                        "N/A"
                                    )}
                                </li>
                            </ul>
                            <p className="mt-3">
                                <strong>Address:</strong>{" "}
                                {`${card.address?.street || ""} ${card.address?.houseNumber || ""
                                    }, ${card.address?.city || ""}, ${card.address?.state ? `${card.address?.state}, ` : ""
                                    }${card.address?.country || ""} ${card.address?.zip ? `- ${card.address?.zip}` : ""
                                    }`.trim() || "No address available"}
                            </p>
                            {MapComponent && <MapComponent isLoaded={isLoaded} />}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    gap: "5px",
                                }}
                                onClick={handleToggleLike}
                            >
                                {user && card.likes.includes(user._id) ? (
                                    <i className="fa-solid fa-heart text-danger"></i>
                                ) : (
                                    <i className="fa-regular fa-heart"></i>
                                )}
                                <span>{card.likes?.length || 0}</span>
                            </div>
                            <a href={`tel:${card.phone}`}><i className="fa-solid fa-phone" style={{ cursor: "pointer" }}></i></a>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="container my-5">
                    <div className="alert alert-danger" role="alert">
                        Card not found.
                    </div>
                </div>
            )}
        </>
    );
}

export default CardPage;
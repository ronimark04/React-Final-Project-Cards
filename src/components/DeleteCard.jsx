import { useEffect, useState } from "react";
import { deleteCard, getCardById } from "../services/cardsService";

function DeleteCard({ cardId }) {
    const [card, setCard] = useState({});

    useEffect(() => {
        if (cardId) {
            getCardById(cardId)
                .then((res) => {
                    setCard(res.data);
                })
                .catch(err => console.error(err));
        }
    }, [cardId]);

    return (<>
        <h5>Are you sure you want to delete {card.title}?</h5>
    </>);
}

export default DeleteCard;
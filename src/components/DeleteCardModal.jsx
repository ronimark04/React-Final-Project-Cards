import { Button, Modal } from "react-bootstrap";
import DeleteCard from "./DeleteCard";
import { deleteCard, getCardById } from "../services/cardsService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function DeleteCardModal({ show, onHide, requestRender, cardId, bizNumber }) {
    const navigate = useNavigate();
    const [card, setCard] = useState({});
    useEffect(() => {
        if (cardId) {
            getCardById(cardId)
                .then((res) => {
                    setCard(res.data);
                    console.log(card);
                })
                .catch(err => console.error(err));
        }
    }, [cardId]);

    function handleDelete() {
        deleteCard(cardId, bizNumber)
            .then((res) => {
                onHide();
                requestRender();
                toast.success(`${card.title} has been deleted successfully`);
            })
            .catch(err => console.error(err));
    };

    return (<>
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Delete Card
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <DeleteCard onHide={onHide} requestRender={requestRender} cardId={cardId} />
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn btn-danger" onClick={handleDelete}>Delete</Button>
                <Button onClick={onHide}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    </>);
}

export default DeleteCardModal;
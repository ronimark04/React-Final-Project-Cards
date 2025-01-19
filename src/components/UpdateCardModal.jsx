import { Button, Modal } from "react-bootstrap";
import { useRef } from "react";
import UpdateCard from "./updateCard";

function UpdateCardModal({ show, onHide, requestRender, cardId }) {
    const updateCardRef = useRef();

    const handleUpdate = () => {
        if (updateCardRef.current) {
            updateCardRef.current.submitForm();
        }
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Edit Card
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <UpdateCard
                    ref={updateCardRef}
                    onHide={onHide}
                    requestRender={requestRender}
                    cardId={cardId}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn btn-danger" onClick={handleUpdate}>
                    Submit Changes
                </Button>
                <Button onClick={onHide}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UpdateCardModal;
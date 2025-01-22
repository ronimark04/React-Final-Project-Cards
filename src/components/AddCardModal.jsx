import { Button, Modal } from "react-bootstrap";
import { useContext, useRef } from "react";
import AddCard from "./AddCard";
import { SiteTheme } from "../App";

function AddCardModal({ show, onHide, requestRender }) {
    const addCardRef = useRef();

    const handleAdd = () => {
        if (addCardRef.current) {
            addCardRef.current.submitForm();
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
                    Create New Card
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <AddCard
                    ref={addCardRef}
                    onHide={onHide}
                    requestRender={requestRender}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button className="btn btn-danger" onClick={handleAdd}>
                    Add Card
                </Button>
                <Button onClick={onHide}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddCardModal;
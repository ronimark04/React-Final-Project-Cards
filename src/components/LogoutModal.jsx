import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function LogoutModal({ onHide, show, requestRender }) {
    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.removeItem("token");
        onHide();
        requestRender();
        navigate("/home");
        toast("You have successfully logged out");
    };

    return (
        <>
            <Modal show={show} onHide={onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Logout</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to log out?</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleLogout}>
                        Yes
                    </Button>
                    <Button variant="secondary" onClick={onHide}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default LogoutModal;
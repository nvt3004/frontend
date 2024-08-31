import React from 'react';
import { Modal } from 'react-bootstrap';

const FeedbackModal = ({show, handleClose}) => {
    return (
        <div>
            <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Feedbacks</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <h1>This is feedback modal</h1>
        </Modal.Body>
      </Modal>

        </div>
    );
}

export default FeedbackModal;

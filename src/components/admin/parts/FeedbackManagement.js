import React, { useState } from 'react';
import FeedbackModal from './FeedbackModal';

const FeedbackManagement = () => {
    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () => {
        setShowModal(true);
    }
    const handleCloseModal = () => {
        setShowModal(false);
    }
    return (
        <div>
            <h1>This is feedback's management</h1>
            <button onClick={handleShowModal}>Show modal</button>
            <FeedbackModal show={showModal} handleClose={handleCloseModal}/>
        </div>
    );
}

export default FeedbackManagement;

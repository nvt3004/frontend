import React from 'react';
import { Modal } from 'react-bootstrap';
import { AiOutlineProduct } from 'react-icons/ai';

const SupplierModal = (supplier, show, handleClose, isNew) => {
    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>
                        <AiOutlineProduct />&ensp;<p className='mb-0 fs-3'>{isNew ? `New Supplier` : `Supplier Infomations`}</p>
                    </Modal.Title>
                </Modal.Header>
            </Modal>
        </div>
    );
}

export default SupplierModal;

import React, { useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { AiOutlineProduct } from 'react-icons/ai';
import CustomButton from '../../component/CustomButton';
import CustomFormControl from '../../component/CustomFormControl';

const SupplierModal = ({supplier, show, handleClose, isNew}) => {
    const handleCancel  = () => {
        handleClose();
        setEdit(false)
    }
    const [isEdit, setEdit] = useState(false);
    const handleSetEdit = () => {
        setEdit(true);
    }
    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title className='d-flex align-items-center'>
                        <AiOutlineProduct />&ensp;<p className='mb-0 fs-3'>{isNew ? `New Supplier` : `Supplier Infomations`}</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Contacter</Form.Label>
                            {/* <Form.Control type='text' defaultValue={supplier?.contactName}/> */}
                            <CustomFormControl type={'text'} defaultValue={supplier?.contactName} isEdit={isEdit} isNew={isNew}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Supplier</Form.Label>
                            <CustomFormControl type={'text'} defaultValue={supplier?.supplierName} isEdit={isEdit} isNew={isNew}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Address</Form.Label>
                            <CustomFormControl type={'text'} defaultValue={supplier?.address} isEdit={isEdit} isNew={isNew}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Phone</Form.Label>
                            <CustomFormControl type={'text'} defaultValue={supplier?.phone} isEdit={isEdit} isNew={isNew}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <CustomFormControl type={'text'} defaultValue={supplier?.email} isEdit={isEdit} isNew={isNew}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <CustomButton btnBG={'danger'} btnName={'Cancel'} handleClick={handleCancel}/>
                    <CustomButton btnBG={isNew ? 'success' : isEdit ? 'success' : 'warning'}
                        btnName={isNew ? 'Create' : isEdit ? 'Save changed' : 'Change Infomations'}
                        handleClick={!isEdit ? handleSetEdit : ''} textColor={'text-white'}/>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default SupplierModal;

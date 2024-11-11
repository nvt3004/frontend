import React from 'react';
import { Form, Modal } from 'react-bootstrap';
import CustomButton from '../../component/CustomButton';

const CategoryModal = ({show}) => {
    return (
        <div>
            <Modal show={show}>
                <Modal.Body>
                    <Form.Control placeholder='Category name'/>
                </Modal.Body>
                <Modal.Footer>
                    <div className='d-flex'>
                        <CustomButton btnBG={'primary'}/>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default CategoryModal;

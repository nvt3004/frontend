import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const BootstrapToast = ({ show, title, text, close, color }) => {
    return (
        <ToastContainer position='top-end'>
            <Toast show={show} onClose={close} animation={true} autohide delay={3000}>
                <Toast.Header className='fw-bold'>StF Noticed !</Toast.Header>
                <Toast.Body>
                    <div>
                        <p className={`text-${color} fw-bold`}>{title}</p>
                        <p>{text}</p>
                    </div>
                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
}

export default BootstrapToast;

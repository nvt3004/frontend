import React, { useEffect, useState } from 'react';
import { Accordion, Button, Card, Collapse, Form, FormGroup, Modal, Table } from 'react-bootstrap';
import { FaPlus, FaUser } from 'react-icons/fa';
import { FaUpload } from 'react-icons/fa6';
import { IoIosMale } from 'react-icons/io';
import CustomFormControl from '../../component/CustomFormControl';

const UserModal = ({ user, show, handleClose, handleCancel, isNew, isCollapse, handleCollapse, isEdit, handleEdit }) => {
    return (
        <div>
            <Modal show={show} onHide={handleClose} size='xl'>
                <Modal.Header>
                    <Modal.Title className='text-primary d-flex align-items-center mb-0'>
                        {/* {user ? (
                            <>
                                <img src={`${process.env.PUBLIC_URL}/images/DefaultAvatar.png`} className='rounded-circle' alt='logo' style={{ width: "65px" }} />
                                &ensp;{`${user.fullname}`}
                            </>
                        ) : <><FaPlus />&ensp;{'Add new user'}</>} */}
                        <FaUser />&ensp;<p className='mb-0 fs-3'>{isNew ? `New User` : `User Infomations`}</p>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='mb-1'>
                    <Form>
                        <div className='container d-flex' style={{ overflowY: 'auto' }}>
                            <div className='col-2'>
                                <div className='d-flex flex-column align-items-center'>
                                    <img src={`${process.env.PUBLIC_URL}/images/DefaultAvatar.png`} className='rounded-circle' alt='logo' style={{ width: "65px" }} /> <br />
                                    {isNew ? <Button variant='warning' className='custom-radius text-white custom-hover d-flex align-items-center'><FaUpload />&ensp;Upload avatar</Button>
                                        : isEdit ? (<Button variant='warning' className='custom-radius text-white custom-hover d-flex align-items-center'><FaUpload />&ensp;Change avatar</Button>) : ''}
                                </div>
                            </div>
                            <div className='col-5'>
                                <div className='container'>
                                    <h3>Personal Infomation</h3>
                                    <div>
                                        <Form.Group className='mt-1'>
                                            <Form.Label>Fullname</Form.Label>
                                            <Form.Control type='text' placeholder='Fullname . . .' defaultValue={user?.fullname} onKeyDown={(e) => {
                                                if (isEdit === false && isNew === false) {
                                                    e.preventDefault();
                                                }
                                            }}
                                                onPaste={(e) => {
                                                    if (isEdit === false && isNew === false) {
                                                        e.preventDefault();
                                                    }
                                                }} />
                                        </Form.Group>
                                        <Form.Group className='mt-1'>
                                            <Form.Label>Birthday</Form.Label>
                                            <Form.Control type='date' defaultValue={user?.birthday} />
                                        </Form.Group>
                                        <Form.Group className='mt-1'>
                                            <Form.Label>Gender</Form.Label>
                                            <div className='d-flex'>
                                                <Form.Check type='radio' name='gender' label='Male' value='Male' className='col' defaultChecked={user?.gender} />
                                                <Form.Check type='radio' name='gender' label='Female' value='Female' className='col' defaultChecked={!user?.gender} />
                                            </div>
                                        </Form.Group>
                                    </div>
                                </div>
                            </div>
                            <div className='col-5'>
                                <div className='container'>
                                    <h3>Account Infomation</h3>
                                    <div>
                                        <Form.Group className='mt-1'>
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control type='text' placeholder='Username . . .' defaultValue={user?.username} onKeyDown={(e) => {
                                                if (isEdit === false && isNew === false) {
                                                    e.preventDefault();
                                                }
                                            }}
                                                onPaste={(e) => {
                                                    if (isEdit === false && isNew === false) {
                                                        e.preventDefault();
                                                    }
                                                }} />
                                        </Form.Group>
                                        <Form.Group className='mt-1'>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type='email' placeholder='Email . . .' defaultValue={user?.email} onKeyDown={(e) => {
                                                if (isEdit === false && isNew === false) {
                                                    e.preventDefault();
                                                }
                                            }}
                                                onPaste={(e) => {
                                                    if (isEdit === false && isNew === false) {
                                                        e.preventDefault();
                                                    }
                                                }} />
                                        </Form.Group>
                                        <Form.Group className='mt-1'>
                                            <Form.Label>Gender</Form.Label>
                                            <div className='d-flex'>
                                                <Form.Check type='radio' name='role' label='Staff' value='Male' className='col' defaultChecked={user?.gender} />
                                                <Form.Check type='radio' name='role' label='Customer' value='Female' className='col' defaultChecked={!user?.gender} />
                                            </div>
                                        </Form.Group>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer className='d-flex'>
                    <Button className='custom-radius text-white custom-hover' variant='danger' onClick={handleCancel}>Cancel</Button>
                    {user ? (
                        isEdit ?
                            (<Button className='custom-radius text-white custom-hover' variant='success'>Save changed</Button>)

                            : <Button className='custom-radius text-white custom-hover' variant='warning' onClick={handleEdit}>Change infomations</Button>
                    ) :
                        <Button className='custom-radius text-white custom-hover' variant='success'>Create</Button>
                    }

                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default UserModal;

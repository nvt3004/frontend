import React, { useEffect, useState } from 'react';
import { Accordion, Button, Card, Collapse, Form, FormGroup, Modal, Table } from 'react-bootstrap';
import { FaPlus, FaUser } from 'react-icons/fa';
import { FaUpload } from 'react-icons/fa6';
import { IoIosMale } from 'react-icons/io';

const UserModal = ({ user, show, handleClose, isNew }) => {
    const [isEdit, setEdit] = useState(false);
    const handleChaneValue = (e) => {
        if (!isEdit) {
            e.preventDefault();
        }
    }
    const handleSetEdit = () => {
        setEdit(true);
    }
    const handleCancel = () => {
        handleClose();
        setEdit(false);
    }
    const [isCollapse, setCollapse] = useState(false);
    const handleOpenCollaspe = () => {
        setCollapse(true);
    }

    useEffect(() => {
        console.log(isEdit);

    }, []);
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
                            {/* <div className='d-flex align-items-center justify-content-between mb-2'>
                            <div className='d-flex flex-column align-items-center'>
                                <img src={`${process.env.PUBLIC_URL}/images/DefaultAvatar.png`} className='rounded-circle' alt='logo' style={{ width: "65px" }} /> <br />
                                {isNew ? <Button variant='warning' className='custom-radius text-white custom-hover d-flex align-items-center'><FaUpload />&ensp;Upload avatar</Button>
                                    : isEdit ? (<Button variant='warning' className='custom-radius text-white custom-hover d-flex align-items-center'><FaUpload />&ensp;Change avatar</Button>) : ''}
                            </div>
                            <Form.Group>
                                <Form.Label className='font-16 fw-medium'>Username</Form.Label>
                                <Form.Control type='text' className='custom-radius px-3 py-1' value={user?.username} onChange={handleChaneValue} />
                            </Form.Group>
                        </div>
                        <Form.Group>
                            <Form.Label className='font-16 fw-medium'>Fullname</Form.Label>
                            <Form.Control type='text' className='custom-radius px-3 py-1' value={user?.fullname} onChange={handleChaneValue} />

                        </Form.Group>
                        <Form.Group className='mt-2'>
                            <Form.Label className='font-16 fw-medium'>Active</Form.Label>
                            <div className='d-flex'>
                                <Form.Check className='col' type='radio' name='active' label='Activating' defaultChecked={user?.active} />
                                <Form.Check className='col' type='radio' name='active' label='Inactive' defaultChecked={!user?.active} />
                            </div>
                        </Form.Group> */}
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
                                            <Form.Control type='text' placeholder='Fullname . . .' defaultValue={user?.fullname} onChange={handleChaneValue} />
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
                                            <Form.Control type='text' placeholder='Username . . .' />
                                        </Form.Group>
                                        <Form.Group className='mt-1'>
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type='email' placeholder='Email . . .' />
                                        </Form.Group>
                                        <Form.Group className='mt-1'>
                                            <Form.Label>Permissions</Form.Label> <br />
                                            {/* <Form.Select>
                                            <option>--- --- ---</option>
                                            <option onClick={() => {setCollapse(!isCollapse) ; console.log('select permissions');
                                            }}>Select permission</option>
                                        </Form.Select> */}
                                            <Button variant='secondary' className='w-100 custom-radius' onClick={() => { setCollapse(!isCollapse) }}>
                                                {`${isCollapse ? 'Hide permissions' : 'Show permissions'}`}
                                            </Button>
                                            <Collapse in={isCollapse}>
                                                <div className='mt-2'>
                                                    <Accordion alwaysOpen>
                                                        <Accordion.Item eventKey="0">
                                                            <Accordion.Header>User Management</Accordion.Header>
                                                            <Accordion.Body className='d-flex align-items-center'>
                                                                <div className='col d-flex align-items-center'>
                                                                    <Form.Group controlId='c-user' className=''>
                                                                        <Form.Label className='m-0'>Create new user</Form.Label>
                                                                    </Form.Group>
                                                                </div>
                                                                <div className='col d-flex align-items-center'>
                                                                    <Form.Group controlId='c-user'>
                                                                        <Form.Check type='checkbox' />
                                                                    </Form.Group>
                                                                </div>
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                        <Accordion.Item eventKey="1">
                                                            <Accordion.Header>Supplier Management</Accordion.Header>
                                                            <Accordion.Body className='d-flex align-items-center'>
                                                                <div className='col d-flex align-items-center'>
                                                                    <Form.Group controlId='c-supplier' className=''>
                                                                        <Form.Label className='m-0'>Create new supplier</Form.Label>
                                                                    </Form.Group>
                                                                </div>
                                                                <div className='col d-flex align-items-center'>
                                                                    <Form.Group controlId='c-supplier'>
                                                                        <Form.Check type='checkbox' />
                                                                    </Form.Group>
                                                                </div>
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    </Accordion>
                                                </div>
                                            </Collapse>
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

                            : <Button className='custom-radius text-white custom-hover' variant='warning' onClick={handleSetEdit}>Change infomations</Button>
                    ) :
                        <Button className='custom-radius text-white custom-hover' variant='success'>Save</Button>
                    }

                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default UserModal;

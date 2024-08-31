import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { ButtonHover } from './StyledButton';

const EditPermissionModal = ({ show, handleClose, userData }) => {
    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <h1>Edit User's Permission</h1>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label for="" className="form-label">Fullname</label>
                        <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                            aria-describedby="helpId"
                            placeholder=""
                            defaultValue={userData?.fullname}
                            onKeyDown={(e) => e.preventDefault()}
                        />
                    </div>
                    <div className="mb-3">
                        <label for="" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                            aria-describedby="helpId"
                            placeholder=""
                            defaultValue={userData?.username}
                            onKeyDown={(e) => e.preventDefault()}
                        />
                    </div>
                    <div className="mb-3">
                        <label for="" className="form-label">Role</label>
                        <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                            aria-describedby="helpId"
                            placeholder=""
                            defaultValue={userData?.role}
                            onKeyDown={(e) => e.preventDefault()}
                        />
                    </div>
                    <div className="mb-3">
                        <label for="" className="form-label">Permission</label>
                        <input
                            type="text"
                            className="form-control"
                            name=""
                            id=""
                            aria-describedby="helpId"
                            placeholder=""
                            defaultValue={userData?.permission}
                            onKeyDown={(e) => e.preventDefault()}
                        />
                    </div>
                    <div className="mb-3">
                        <label for="" className="form-label">Active</label>
                        <Form.Select defaultValue={userData?.permission?.active ? 'Active' : 'Inactive'}>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </Form.Select>
                    </div>
                    <ButtonHover className='btn btn-success px-3 py-2 rounded-5'>Save</ButtonHover>

                </Modal.Body>
            </Modal>
        </div>
    );
}

export default EditPermissionModal;

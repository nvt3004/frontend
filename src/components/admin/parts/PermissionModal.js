import React, { useState } from 'react';
import { Modal, Table } from 'react-bootstrap';

const PermissionModal = ({ show, handleClose }) => {
    const [permissions, setPermissions] = useState({
        productManagement: { add: false, update: false, remove: false, all: false },
        supplierManagement: { add: false, update: false, remove: false, all: false },
        orderManagement: { add: false, update: false, remove: false, all: false },
        feedbackManagement: { add: false, update: false, remove: false, all: false },
    });

    const handlePermissionChange = (section, permission) => {
        const newPermissions = { ...permissions };
        newPermissions[section][permission] = !newPermissions[section][permission];

        // Nếu không phải là "All", kiểm tra lại trạng thái của "All"
        if (permission !== 'all') {
            newPermissions[section].all =
                newPermissions[section].add && 
                newPermissions[section].update &&
                newPermissions[section].remove;
        } else {
            // Nếu là "All", kiểm tra hoặc bỏ chọn tất cả các quyền trong hàng
            newPermissions[section].add = newPermissions[section].all;
            newPermissions[section].update = newPermissions[section].all;
            newPermissions[section].remove = newPermissions[section].all;
        }

        setPermissions(newPermissions);
    };

    return (
        <div>
            <Modal show={show} onHide={handleClose} size="xl">
                <Modal.Header closeButton>
                    <h4>Permissions</h4>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr className='text-center'>
                                <th></th>
                                <th>Add new</th>
                                <th>Update</th>
                                <th>Remove</th>
                                <th>All</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className='text-center'>
                                <td>Product Management</td>
                                <td>
                                    <input
                                        type='checkbox'
                                        checked={permissions.productManagement.add}
                                        onChange={() => handlePermissionChange('productManagement', 'add')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type='checkbox'
                                        checked={permissions.productManagement.update}
                                        onChange={() => handlePermissionChange('productManagement', 'update')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type='checkbox'
                                        checked={permissions.productManagement.remove}
                                        onChange={() => handlePermissionChange('productManagement', 'remove')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type='checkbox'
                                        checked={permissions.productManagement.all}
                                        onChange={() => handlePermissionChange('productManagement', 'all')}
                                    />
                                </td>
                            </tr>
                            <tr className='text-center'>
                                <td>Supplier Management</td>
                                <td>
                                    <input
                                        type='checkbox'
                                        checked={permissions.supplierManagement.add}
                                        onChange={() => handlePermissionChange('supplierManagement', 'add')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type='checkbox'
                                        checked={permissions.supplierManagement.update}
                                        onChange={() => handlePermissionChange('supplierManagement', 'update')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type='checkbox'
                                        checked={permissions.supplierManagement.remove}
                                        onChange={() => handlePermissionChange('supplierManagement', 'remove')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type='checkbox'
                                        checked={permissions.supplierManagement.all}
                                        onChange={() => handlePermissionChange('supplierManagement', 'all')}
                                    />
                                </td>
                            </tr>
                            <tr className='text-center'>
                                <td>Order Management</td>
                                <td>
                                    <input
                                        type='checkbox'
                                        checked={permissions.orderManagement.add}
                                        onChange={() => handlePermissionChange('orderManagement', 'add')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type='checkbox'
                                        checked={permissions.orderManagement.update}
                                        onChange={() => handlePermissionChange('orderManagement', 'update')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type='checkbox'
                                        checked={permissions.orderManagement.remove}
                                        onChange={() => handlePermissionChange('orderManagement', 'remove')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type='checkbox'
                                        checked={permissions.orderManagement.all}
                                        onChange={() => handlePermissionChange('orderManagement', 'all')}
                                    />
                                </td>
                            </tr>
                            <tr className='text-center'>
                                <td>Feedback Management</td>
                                <td>
                                    <input
                                        type='checkbox'
                                        checked={permissions.feedbackManagement.add}
                                        onChange={() => handlePermissionChange('feedbackManagement', 'add')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type='checkbox'
                                        checked={permissions.feedbackManagement.update}
                                        onChange={() => handlePermissionChange('feedbackManagement', 'update')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type='checkbox'
                                        checked={permissions.feedbackManagement.remove}
                                        onChange={() => handlePermissionChange('feedbackManagement', 'remove')}
                                    />
                                </td>
                                <td>
                                    <input
                                        type='checkbox'
                                        checked={permissions.feedbackManagement.all}
                                        onChange={() => handlePermissionChange('feedbackManagement', 'all')}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default PermissionModal;

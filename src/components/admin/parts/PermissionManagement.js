import React, { useRef, useState } from 'react';
import { Table, Form, Pagination, Tab, Tabs, Button } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';
import EditPermissionModal from './EditPermissionModal';

const permissionsData = [
    { id: 1, name: 'View Products', description: 'View product list and details', group: 'Product Management', active: true },
    { id: 2, name: 'Edit Products', description: 'Edit product information', group: 'Product Management', active: true },
    { id: 3, name: 'Delete Products', description: 'Delete products from the catalog', group: 'Product Management', active: false },
    { id: 4, name: 'View Orders', description: 'View all orders', group: 'Order Management', active: true },
    { id: 5, name: 'Edit Orders', description: 'Modify order details', group: 'Order Management', active: true },
    { id: 6, name: 'Cancel Orders', description: 'Cancel orders', group: 'Order Management', active: false },
    { id: 7, name: 'View Users', description: 'View user information', group: 'User Management', active: true },
    { id: 8, name: 'Edit Users', description: 'Edit user profiles', group: 'User Management', active: true },
    { id: 9, name: 'Delete Users', description: 'Remove users from the system', group: 'User Management', active: false },
    { id: 10, name: 'View Reports', description: 'Access and view system reports', group: 'Report Management', active: true },
    { id: 11, name: 'Generate Reports', description: 'Generate new reports', group: 'Report Management', active: true },
    { id: 12, name: 'Edit Reports', description: 'Modify existing reports', group: 'Report Management', active: false },
    { id: 13, name: 'Manage Settings', description: 'Change system settings', group: 'System Management', active: true },
    { id: 14, name: 'View Logs', description: 'View system logs', group: 'System Management', active: true },
    { id: 15, name: 'Delete Logs', description: 'Delete system logs', group: 'System Management', active: false },
];

const assignData = [
    { id: 1, fullname: 'Nguyen Van A', username: 'nva', role: 'Admin', permission: 'View Products', active: true },
    { id: 2, fullname: 'Tran Thi B', username: 'ttb', role: 'Staff', permission: 'Edit Products', active: true },
    { id: 3, fullname: 'Le Van C', username: 'lvc', role: 'Staff', permission: 'Delete Products', active: false },
    { id: 4, fullname: 'Pham Van D', username: 'pvd', role: 'Admin', permission: 'View Orders', active: true },
    { id: 5, fullname: 'Hoang Thi E', username: 'hte', role: 'Staff', permission: 'Edit Orders', active: true },
    { id: 6, fullname: 'Vuong Van F', username: 'vvf', role: 'Staff', permission: 'Cancel Orders', active: false },
    { id: 7, fullname: 'Nguyen Thi G', username: 'ntg', role: 'Admin', permission: 'View Users', active: true },
    { id: 8, fullname: 'Tran Van H', username: 'tvh', role: 'Staff', permission: 'Edit Users', active: true },
    { id: 9, fullname: 'Le Thi I', username: 'lti', role: 'Staff', permission: 'Delete Users', active: false },
    { id: 10, fullname: 'Pham Van J', username: 'pvj', role: 'Admin', permission: 'View Reports', active: true },
    { id: 11, fullname: 'Hoang Thi K', username: 'htk', role: 'Staff', permission: 'Generate Reports', active: true },
    { id: 12, fullname: 'Vuong Van L', username: 'vvl', role: 'Staff', permission: 'Edit Reports', active: false },
    { id: 13, fullname: 'Nguyen Thi M', username: 'ntm', role: 'Admin', permission: 'Manage Settings', active: true },
    { id: 14, fullname: 'Tran Van N', username: 'tvn', role: 'Staff', permission: 'View Logs', active: true },
    { id: 15, fullname: 'Le Thi O', username: 'lto', role: 'Staff', permission: 'Delete Logs', active: false },
];

const PermissionManagement = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Tính toán dữ liệu hiển thị dựa trên phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPermissions = permissionsData.slice(indexOfFirstItem, indexOfLastItem);
    const currentAssigns = assignData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPagesPermissions = Math.ceil(permissionsData.length / itemsPerPage);
    const totalPagesAssigns = Math.ceil(assignData.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [showModal, setShowModal] = useState(false);
    const [userData, setUserData] = useState(null);
    const handleChangePermissionActivate = () => {
        Swal.fire({
            title: `Are you want to change the activate of this user's permission ?`,
            text: `User might not can access to this permission's pages.`,
            icon: 'warning',
            showConfirmButton: true,
            showCancelButton: true
        });
    }

    return (
        <div className='container-fluid'>
            <div className='d-flex'>
                <h1>Permission Management</h1>
            </div>
            {/* <Tabs defaultActiveKey={'listPermission'}>
                <Tab eventKey={'listPermission'} title='Permissions'>
                    <Table striped bordered hover responsive className='mt-3'>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Permission Name</th>
                                <th>Description</th>
                                <th>Permission Group</th>
                                <th>Active</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPermissions.map((permission, index) => (
                                <tr key={permission.id}>
                                    <td>{indexOfFirstItem + index + 1}</td>
                                    <td>{permission.name}</td>
                                    <td>{permission.description}</td>
                                    <td>{permission.group}</td>
                                    <td>
                                        <Form.Select defaultValue={permission.active ? 'Active' : 'Inactive'}>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </Form.Select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Pagination className='justify-content-center'>
                        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                        {[...Array(totalPagesPermissions).keys()].map(number => (
                            <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => handlePageChange(number + 1)}>
                                {number + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPagesPermissions} />
                        <Pagination.Last onClick={() => handlePageChange(totalPagesPermissions)} disabled={currentPage === totalPagesPermissions} />
                    </Pagination>
                </Tab>
                <Tab eventKey={'assign'} title='Assign'>
                    
                </Tab>
            </Tabs> */}
            <Table striped bordered hover responsive className='mt-3'>
                <thead>
                    <tr className='text-center'>
                        <th></th>
                        <th>Full Name</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Permission</th>
                        <th>Active</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {currentAssigns.map((assign, index) => (
                        <tr key={assign.id} className='text-center'>
                            <td>{indexOfFirstItem + index + 1}</td>
                            <td>{assign.fullname}</td>
                            <td>{assign.username}</td>
                            <td>{assign.role}</td>
                            <td>{assign.permission}</td>
                            <td>{assign.active ? 'Active' : 'Inactive'}</td>
                            <td className='d-flex justify-content-around'>
                                <Button variant='warning' className='text-white' onClick={() => { setShowModal(true); setUserData(assign) }}><FaEdit /></Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Pagination className='justify-content-start'>
                <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                {[...Array(totalPagesAssigns).keys()].map(number => (
                    <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => handlePageChange(number + 1)}>
                        {number + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPagesAssigns} />
                <Pagination.Last onClick={() => handlePageChange(totalPagesAssigns)} disabled={currentPage === totalPagesAssigns} />
            </Pagination>
            <div>
                <EditPermissionModal show={showModal} handleClose={() => { setShowModal(false) }} userData={userData} />
            </div>
        </div>
    );
};

export default PermissionManagement;

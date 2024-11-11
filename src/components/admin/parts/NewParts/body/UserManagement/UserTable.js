import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup, Pagination, Table } from 'react-bootstrap';
import { FaEye, FaFileExport, FaPlus, FaSearch } from 'react-icons/fa';
import users from './data';
import UserModal from './UserModal';
import { HiMiniUserGroup } from "react-icons/hi2";
import { IoIosFemale, IoIosMale } from 'react-icons/io';
import { CiSquareRemove } from "react-icons/ci";
import { IoPersonRemoveSharp } from 'react-icons/io5';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import DoRequest from '../../../../axiosRequest/doRequest';
import CustomButton from '../../component/CustomButton';
import EmptyValues from '../../component/errorPages/EmptyValues';
import { FaArrowRight } from "react-icons/fa6";

const UserTable = () => {
    let active = 2;
    let items = [];
    for (let number = 1; number <= 2; number++) {
        items.push(
            <Pagination.Item className='' key={number} active={number === active}>
                {number}
            </Pagination.Item>,
        );
    }

    const [showModal, setShowModal] = useState(false);
    const [selecteddUser, setSelectedUser] = useState(null);
    const [isNew, setNew] = useState(false);
    const [isCollapse, setCollapse] = useState(false);
    const [isEdit, setEdit] = useState(false);

    const handleShowModal = (user) => {
        setShowModal(true);
        if (user) {
            setSelectedUser(user);
        } else {
            setNew(true);
        }
    }
    const handleCloseModal = () => {
        setShowModal(false);
        setNew(false);
        setSelectedUser(null);
    }
    const handleCollapse = () => {
        setCollapse(!isCollapse);
    }
    const handleEdit = () => {
        setEdit(true);
    }
    const handleCancel = () => {
        setShowModal(false);
        setEdit(false);
        setSelectedUser(null);
    }

    const handleRemoveUser = (user) => {
        Swal.fire({
            title: 'Confirm to remove',
            text: 'Are you sure ? You might not recover this account !!',
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: `Yes, I'm sure !`
        }).then((isConfirm) => {
            if (isConfirm.isConfirmed) {

                // const doRemoveAPI = () => {
                //     const removeUser = DoRequest({ token: token }).delete(`/api/test/user/delete/${user?.userId}`)
                //         .then(() => {
                //             handleGetUser();
                //         });
                //     return removeUser;
                // }

                // toast.promise(
                //     doRemoveAPI, {
                //     pending: 'Removing...',
                //     success: `${user?.fullName} has been removed !!`,
                //     error: `There's something wrong...`
                // }, {
                //     position: 'top-right',
                //     autoClose: 3000,
                //     closeOnClick: true,
                // }
                // )
                toast.success(`${user?.fullName} has been removed !!`, {
                    position: 'top-right',
                    autoClose: 3000,
                    closeOnClick: true,
                })
            }
        });
    }

    return (
        <div className='font-14'>
            <div className='bg-body-tertiary d-flex align-items-center' style={{ height: "50px" }}>
                <div className='container d-flex justify-content-between align-items-center'>
                    <h4 className='m-0 col-2 d-flex align-items-center'><HiMiniUserGroup />&ensp;Users</h4>
                    <div className='col-10 d-flex justify-content-around'>
                        <InputGroup className='w-30'>
                            <InputGroup.Text className='custom-radius'><FaSearch /></InputGroup.Text>
                            <Form.Control className='custom-radius' placeholder='Search users . . .' />
                        </InputGroup>
                        <Form.Select className='w-15 bg-body-secondary font-14 custom-radius custom-hover'>
                            <option className='text-center'>Filter by gender</option>
                            <option>Male</option>
                            <option>Female</option>
                        </Form.Select>
                        <Button variant='secondary' className='font-14 custom-radius custom-hover'><FaFileExport /> {` Export`}</Button>
                        <Button className='font-14 custom-radius custom-hover' onClick={() => handleShowModal()}><FaPlus />{` Add new user`}</Button>
                        {/* <CustomButton btnBG={'primary'} btnName={'Load data'} handleClick={handleGetUser} /> */}
                    </div>
                </div>
            </div>
            <div>

                {users.length > 0 ? (
                    <div>
                        <Table className='mb-0' variant='' hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Username</th>
                                    <th>Fullname</th>
                                    <th>Birthday</th>
                                    <th>Gender</th>
                                    <th>Email</th>
                                    <th>Active</th>
                                    <th></th>
                                    <th className=''>Remove</th>
                                    <th>Perms</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users?.map((item, index) => (
                                    <tr key={index} className='font-13 custom-table'>
                                        <td>{index + 1}</td>
                                        <td>
                                            <img src={`${process.env.PUBLIC_URL}/images/DefaultAvatar.png`} alt='staff avatar' style={{ height: "50px", width: "auto" }} />
                                            {` ${item?.username}`}
                                        </td>
                                        <td>{item?.fullName}</td>
                                        <td>{item?.birthday}</td>
                                        <td>
                                            {item?.gender ? (<><IoIosMale className='text-primary fs-5' /> &ensp;{`Male`}</>)
                                                : (<><IoIosFemale className='text-danger fs-5' /> &ensp;{`Female`}</>)}
                                        </td>
                                        <td>{item?.email}</td>
                                        <td className={`${item?.active ? 'text-success' : 'text-danger'} fw-medium`}>{item?.active ? 'Activating' : 'Inactive'}</td>
                                        <td className='font-16'><FaEye className='eye-show' onClick={() => handleShowModal(item)} /></td>
                                        <td className=''>
                                            {item?.active ? '' : (
                                                <Button variant='danger' className='d-flex align-items-center custom-radius' onClick={() => handleRemoveUser(item)}>
                                                    <IoPersonRemoveSharp className='font-16 fw-medium' />
                                                </Button>
                                            )}
                                        </td>
                                        <td>
                                            <CustomButton btnBG={'warning'} btnName={<FaArrowRight/>}/>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <div className='bg-body-tertiary d-flex justify-content-between align-items-center container pt-2'>
                            <p className='font-13'>{`1 to 10 items of 15 `} <span><a href='#' className='text-decoration-none fw-medium'>{`View all >`}</a></span></p>
                            <Pagination className='border-0'>
                                <Pagination.First>{`<`}</Pagination.First>
                                {items}
                                <Pagination.Last>{`>`}</Pagination.Last>
                            </Pagination>
                        </div>
                    </div>

                ) : (<div><EmptyValues text={'Data may have a bit time to load success !!'}/></div>)}
            </div>
            <div>
                <UserModal show={showModal} handleClose={handleCloseModal} handleCancel={handleCancel} user={selecteddUser} isNew={isNew}
                    isCollapse={isCollapse} handleCollapse={handleCollapse}
                    isEdit={isEdit} handleEdit={handleEdit} />
                <ToastContainer />
            </div>
        </div>
    );
}

export default UserTable;

import React, { useState } from 'react';
import { Button, Form, InputGroup, Pagination, Table } from 'react-bootstrap';
import { FaEye, FaFileExport, FaPlus, FaSearch } from 'react-icons/fa';
import suppliers from './data';
import { FaParachuteBox } from "react-icons/fa";
import SupplierModal from './SupplierModal';

const SuppliersTable = () => {
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
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [isNew, setNew] = useState(false);
    const [isEdit, setEdit] = useState(false);

    const handleShowModal = (supplier) => {
        setShowModal(true);
        if (supplier) {
            setSelectedSupplier(supplier);
        } else {
            setNew(true);
        }
    }
    const handleCloseModal = () => {
        setShowModal(false);
        setNew(false);
        setSelectedSupplier(null);
    }
    const handleCancel = () => {
        setShowModal(false);
        setEdit(false);
        setSelectedSupplier(null);
    }
    const handleEdit = () => {
        setEdit(true);
    }
    return (
        <div className='font-14'>
            <div className='bg-body-tertiary d-flex align-items-center' style={{ height: "50px" }}>
                <div className='container d-flex justify-content-between align-items-center'>
                    <h4 className='m-0 col-2 d-flex align-items-center'><FaParachuteBox />&ensp;Suppliers</h4>
                    <div className='col-10 d-flex justify-content-around'>
                        <InputGroup className='w-30'>
                            <InputGroup.Text className='custom-radius'><FaSearch /></InputGroup.Text>
                            <Form.Control className='custom-radius' placeholder='Search users . . .' />
                        </InputGroup>
                        <Button variant='secondary' className='font-14 custom-radius custom-hover'><FaFileExport /> {` Export`}</Button>
                        <Button className='font-14 custom-radius custom-hover' onClick={() => handleShowModal()}><FaPlus />{` Add new supplier`}</Button>
                    </div>
                </div>
            </div>
            <div className=''>
                <Table className='mb-0' variant='' hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Contacter</th>
                            <th>Supplier</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Adress</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers?.map((item, index) => (
                            <tr className='font-13 custom-table'>
                                <td>{index + 1}</td>
                                <td>{item?.contactName}</td>
                                <td className='fw-medium'>
                                    {/* <img src={`${process.env.PUBLIC_URL}/images/DefaultAvatar.png`} alt='staff avatar' style={{ height: "50px", width: "auto" }} /> */}
                                    {` ${item?.supplierName}`}
                                </td>
                                <td>{item?.email}</td>
                                <td className='fw-medium'>{item?.phone}</td>
                                <td>{item?.address}</td>
                                <td className='font-16'><FaEye className='eye-show' onClick={() => handleShowModal(item)} /></td>
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
            <div>
                <SupplierModal supplier={selectedSupplier} show={showModal} handleClose={handleCloseModal} isNew={isNew}
                    isEdit={isEdit} handelEdit={handleEdit} handleCancel={handleCancel} />
            </div>
        </div>
    );
}

export default SuppliersTable;

import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { FaPlusSquare, FaRegEye } from 'react-icons/fa';
import WarehouseProductModal from './WarehouseProductModal';

const WarehouseManagement = () => {
    const sampleData = [
        { id: 1, product: "Laptop", supplier: "Dell", price: 1000, quantity: 50 },
        { id: 2, product: "Mouse", supplier: "Logitech", price: 20, quantity: 200 },
        { id: 3, product: "Keyboard", supplier: "Razer", price: 100, quantity: 150 },
        { id: 4, product: "Monitor", supplier: "Samsung", price: 300, quantity: 30 },
        { id: 5, product: "Printer", supplier: "HP", price: 150, quantity: 25 },
        { id: 6, product: "Router", supplier: "TP-Link", price: 50, quantity: 100 },
    ];

    const [showModal, setShowModal] = useState(false);
    const [warehouseItem, setWarehouseItem] = useState(null);
    const handleShowModal = (item) =>{
        setShowModal(true);
        setWarehouseItem(item);
    }
    const handleCloseModal = () =>{
        setShowModal(false);
    }

    return (
        <div>
            <div className='d-flex justify-content-between mb-3'>
                <h2>Warehouse Management</h2>
                <div className='d-flex justify-content-around mt-2'>
                    <Button variant='success' style={{ maxHeight: "40px" }}><FaPlusSquare /></Button>
                </div>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr className='text-center'>
                        <th></th>
                        <th>Product</th>
                        <th>Supplier</th>
                        <th>Import price</th>
                        <th>Quantity</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {sampleData.map((item, index) => (
                        <tr key={item.id} className="text-center">
                            <td>{index + 1}</td>
                            <td>{item.product}</td>
                            <td>{item.supplier}</td>
                            <td>${item.price}</td>
                            <td>{item.quantity}</td>
                            <td>
                                <button className="btn bg-body-secondary rounded-start-pill rounded-end-pill" onClick={() => handleShowModal(item)}><FaRegEye/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div>
                <WarehouseProductModal show={showModal} handleClose={() => handleCloseModal()} item={warehouseItem}/>
            </div>
        </div>
    );
}

export default WarehouseManagement;

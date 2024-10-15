import React, { useState } from 'react';
import { Modal, Table } from 'react-bootstrap';

const WarehouseProductModal = ({ show, handleClose, item }) => {
    const [defaultImage, setDefaultImmage] = useState(process.env.PUBLIC_URL + '/images/default-image.jpg');
    const versions = [
        {
            versionName: 'DELL001',
            unitPrice: '200',
            attributes: {
                color: 'White',
                material: 'Cotton',
                size: 'Small'
            },
            quantity: 100
        },
        {
            versionName: 'DELL002',
            unitPrice: '220',
            attributes: {
                color: 'Black',
                material: 'Cotton',
                size: 'Small'
            },
            quantity: 100
        },
        {
            versionName: 'DELL003',
            unitPrice: '200',
            attributes: {
                color: 'Red',
                material: 'Cotton',
                size: 'Small'
            },
            quantity: 100
        },
        {
            versionName: 'DELL004',
            unitPrice: '200',
            attributes: {
                color: 'Green',
                material: 'Cotton',
                size: 'Small'
            },
            quantity: 100
        },
        {
            versionName: 'DELL005',
            unitPrice: '250',
            attributes: {
                color: 'White',
                material: 'Cotton',
                size: 'Medium'
            },
            quantity: 100
        },
        {
            versionName: 'DELL006',
            unitPrice: '270',
            attributes: {
                color: 'Black',
                material: 'Cotton',
                size: 'Medium'
            },
            quantity: 100
        },
        {
            versionName: 'DELL007',
            unitPrice: '250',
            attributes: {
                color: 'Red',
                material: 'Cotton',
                size: 'Medium'
            },
            quantity: 100
        },
        {
            versionName: 'DELL008',
            unitPrice: '250',
            attributes: {
                color: 'Green',
                material: 'Cotton',
                size: 'Medium'
            },
            quantity: 100
        },
    ];
    return (
        <div className='scrollbar-admin'>
            {/*style={{ height: '800px', overflowY: "auto" }}*/}
            <Modal show={show} onHide={handleClose} size='lg' >
                <Modal.Header closeButton>
                    <h3>Product: {item?.product}</h3>
                </Modal.Header>
                <Modal.Body>
                    <p>Name: <span>{item?.product}</span></p>
                    <p>Retail price: <span>{item?.price}</span></p>
                    <p>Supplier: <span>{item?.supplier}</span></p>
                    <Table striped bordered hover>
                        <thead className='text-center'>
                            <tr>
                                <th></th>
                                <th>Version</th>
                                <th>Attributes</th>
                                <th>Unit Price</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {versions.map((item, index) => (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>
                                        <p> 
                                            <img src={defaultImage} style={{width: '120px', height: 'auto'}} className='me-3'/>
                                            {item.versionName}
                                        </p>
                                    </td>
                                    <td>
                                        <p>Color: {item.attributes.color}</p>
                                        <p>Size: {item.attributes.size}</p>
                                        <p>Material: {item.attributes.material}</p>
                                    </td>
                                    <td>{`${item.unitPrice}$`}</td>
                                    <td>{item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default WarehouseProductModal;

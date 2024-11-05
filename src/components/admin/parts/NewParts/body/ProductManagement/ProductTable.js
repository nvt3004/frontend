import React, { useEffect, useState } from 'react';
import { Button, Collapse, Form, InputGroup, Pagination, Table } from 'react-bootstrap';
import { AiFillProduct } from 'react-icons/ai';
import { FaFileExport, FaPlus, FaSearch } from 'react-icons/fa';
import products from './data';
import suppliers from '../SuppliersManagement/data';
import CustomButton from '../../component/CustomButton';
import Slider from 'react-slick';

const ProductTable = () => {
    let active = 2;
    let items = [];
    for (let number = 1; number <= 2; number++) {
        items.push(
            <Pagination.Item className='' key={number} active={number === active}>
                {number}
            </Pagination.Item>,
        );
    }

    const mergeProductSupplierDetail = products.map(item => {
        const supplierDetails = suppliers.find(supplier => supplier?.id === parseInt(item?.supplier));
        return {
            ...item,
            supplierDetails: supplierDetails || {}
        };
    });

    const [openCollapse, setOpenCollapse] = useState({});

    const handleToggleCollapse = (id) => {
        setOpenCollapse((prev) => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const settings = {
        dots: false,
        infinite: false, 
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };


    return (
        <div>
            <div className='font-14'>
                <div className='bg-body-tertiary d-flex align-items-center' style={{ height: "50px" }}>
                    <div className='container d-flex justify-content-between align-items-center'>
                        <h4 className='m-0 col-2 d-flex align-items-center'><AiFillProduct />&ensp;Products</h4>
                        <div className='col-10 d-flex justify-content-around'>
                            <InputGroup className='w-30'>
                                <InputGroup.Text className='custom-radius'><FaSearch /></InputGroup.Text>
                                <Form.Control className='custom-radius' placeholder='Search users . . .' />
                            </InputGroup>
                            <Button variant='secondary' className='font-14 custom-radius custom-hover'><FaFileExport /> {` Export`}</Button>
                            {/* <Button className='font-14 custom-radius custom-hover' onClick={() => handleShowModal()}><FaPlus />{` Add new supplier`}</Button> */}
                        </div>
                    </div>
                </div>
                <div className=''>
                    <Table className='mb-0' hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th className=''>Product name</th>
                                <th></th>
                                <th>Supplier</th>
                                <th>Prices</th>
                                <th>Description</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {mergeProductSupplierDetail?.map((item, index) => (
                                <>
                                    <tr className='font-13 custom-table' key={item?.id}>
                                        <td>{index + 1}</td>
                                        <td className='fw-medium font-15'>{item.name}</td>
                                        <td colSpan={1}>
                                            <img src={`${process.env.PUBLIC_URL}/images/${item?.image}`} alt='product-image' style={{ maxHeight: '80px', width: 'auto' }} />
                                        </td>
                                        <td className='fw-medium'>
                                            {/* <img src={`${process.env.PUBLIC_URL}/images/DefaultAvatar.png`} alt='staff avatar' style={{ height: "50px", width: "auto" }} /> */}
                                            {` ${item?.supplierDetails?.supplierName}`}
                                        </td>
                                        <td className='fw-medium'>
                                            {(() => {
                                                const prices = item?.versions.map((version) => parseFloat(version?.retailPrice));
                                                const highest = Math.max(...prices);
                                                const smallest = Math.min(...prices);

                                                return (
                                                    <p className='m-0'>{`${smallest} VND ~ ${highest} VND`}</p>
                                                );
                                            })()}
                                        </td>
                                        <td>{item?.description}</td>
                                        <td>
                                            <CustomButton btnBG={'secondary'} btnName={'Details'} handleClick={() => { handleToggleCollapse(item?.id) }} />
                                        </td>
                                        {/* <td className='font-16'><FaEye className='eye-show' onClick={() => handleShowModal(item)} /></td> */}
                                    </tr>

                                    {openCollapse[item?.id] && (
                                        <tr>
                                            <td colSpan={7}>
                                                <div>
                                                    <Table hover striped className='table-secondary'>
                                                        <thead>
                                                            <tr>
                                                                <th>#</th>
                                                                <th>Version</th>
                                                                <th>Name</th>
                                                                <th></th>
                                                                <th className='text-center'>Retail price</th>
                                                                <th>Attributes</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {item?.versions.map((version, index) => (
                                                                <tr key={version?.id} className='custom-table'>
                                                                    <td>{index +1}</td>
                                                                    <td>{version?.id}</td>
                                                                    <td>{version?.versionName}</td>
                                                                    <td className='w-15' style={{ minHeight: '40px' }}>
                                                                        {version?.images.length > 0 ? (
                                                                            <div style={{ maxWidth: '100px' }} className=''>
                                                                                <Slider {...settings} infinite={version?.images.length > 1}>
                                                                                    {version?.images.map((imageName, index) => {
                                                                                        return (
                                                                                            <div key={index + 1} className='d-flex justify-content-center'>
                                                                                                <img
                                                                                                    src={`${process.env.PUBLIC_URL}/images/${imageName}`}
                                                                                                    alt={`${version?.id}-image`}
                                                                                                    style={{ maxHeight: '100px', width: 'auto' }}
                                                                                                />
                                                                                            </div>
                                                                                        );
                                                                                    })}
                                                                                </Slider>
                                                                            </div>
                                                                        ) : 'This version does not has any images'}
                                                                    </td>
                                                                    <td className='text-center'>{`${version?.retailPrice} VND`}</td>
                                                                    <td>
                                                                        <div>
                                                                            {version?.attributes.map((attribute, index) => (
                                                                                <p key={index + 1} className='m-0'>
                                                                                    {`${attribute?.key === 'Color' ? 'Color' : 'Size'}: ${attribute?.value}`}
                                                                                </p>
                                                                            ))}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>                                               </div>
                                            </td>
                                        </tr>
                                    )}

                                </>
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

                </div>
            </div>
        </div>
    );
}

export default ProductTable;

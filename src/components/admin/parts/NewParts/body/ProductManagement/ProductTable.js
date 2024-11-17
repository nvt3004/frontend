import React, { useEffect, useState } from 'react';
import { Button, Collapse, Form, InputGroup, Pagination, Table } from 'react-bootstrap';
import { AiFillProduct } from 'react-icons/ai';
import { FaFileExport, FaPlus, FaSearch } from 'react-icons/fa';
import CustomButton from '../../component/CustomButton';
import Slider from 'react-slick';
import axiosInstance from '../../../../../../services/axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const ProductTable = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const handleGetProductAPI = () => {
        axiosInstance.get(`/staff/product?page=${currentPage + 1}&size=5`).then(
            (response) => {
                if (response?.data?.code === 200) {
                    setProducts(response?.data?.data?.content);
                    setTotalPage(response?.data?.data?.totalPages);
                    setTotalElements(response?.data?.data?.totalElements);
                    console.log('product: ', products);
                } else {
                    toast.error('Failed to get product from database. Please check for errors and try again');
                }
            }
        );
    }

    useEffect(() => {
        handleGetProductAPI();
    }, [currentPage]);

    const handleSetPage = (page) => {
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    };

    const paginationItems = [];
    for (let number = 0; number < totalPage; number++) {
        paginationItems.push(
            <Pagination.Item key={number} active={number === currentPage}
                onClick={() => handleSetPage(number)}>
                {number + 1}
            </Pagination.Item>
        );
    }



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

    const handleRemoveProduct = (id) => {
        Swal.fire({
            title: 'Are want to remove ?',
            text: 'You might recover this product',
            icon: 'question',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: `OK`,
        }).then(
            (confirmed) => {
                if (confirmed?.isConfirmed) {
                    axiosInstance.delete(`/staff/product/remove/${id}`).then(
                        (response) => {
                            if (response?.data?.code === 200) {
                                toast.success('Product removed successfully !');
                                handleGetProductAPI();
                            } else {
                                toast.error(`Failed to removed product. Please check for errors and try again !!`);
                            }
                        }
                    );
                }
            }
        );
    };

    const handleSetSelectedProduct = (productData) => {
        navigate('/admin/products/update', { state: { product: productData } });
    };
    // useEffect(
    //     () => {
    //         console.log('selected product: ', selectedProduct);
    //     }, [selectedProduct]
    // );

    return (
        <div>
            <div className='font-14'>
                <div className='bg-body-tertiary d-flex align-items-center' style={{ height: "50px" }}>
                    <div className='container d-flex justify-content-between align-items-center'>
                        <h4 className='m-0 col-2 d-flex align-items-center'><AiFillProduct />&ensp;Products</h4>
                        <div className='col-10 d-flex justify-content-around' style={{height: '50px'}}>
                            <InputGroup className='w-30' style={{width: '450px'}}>
                                <InputGroup.Text className='custom-radius'><FaSearch /></InputGroup.Text>
                                <Form.Control className='custom-radius' placeholder='Search product . . .' />
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
                                <th>Category</th>
                                <th>Prices</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products?.map((item, index) => (
                                <React.Fragment key={item?.id}>
                                    <tr className='font-13 custom-table' key={item?.id}>
                                        <td>{index + 1}</td>
                                        <td className='fw-medium font-15'>{item?.productName}</td>
                                        <td colSpan={1}>
                                            <img src={`${item?.image}`} alt='product-image' style={{ maxHeight: '80px', width: 'auto' }} />
                                        </td>
                                        <td className='fw-medium font-14'>
                                            {item?.categories[0]?.name}
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
                                        <td>
                                            <CustomButton btnBG={'secondary'} btnName={'Details'} handleClick={() => { handleToggleCollapse(item?.id) }} />
                                        </td>
                                        {/* <td className='font-16'><FaEye className='eye-show' onClick={() => handleShowModal(item)} /></td> */}
                                    </tr>

                                    {openCollapse[item?.id] && (
                                        <React.Fragment>
                                            <tr>
                                                <td colSpan={6}>
                                                    <div>
                                                        <Table hover striped className='table-secondary'>
                                                            <thead>
                                                                <tr>
                                                                    <th>#</th>
                                                                    <th>Version</th>
                                                                    <th>Name</th>
                                                                    <th>Version images</th>
                                                                    <th className='text-center'>Retail price</th>
                                                                    <th>Attributes</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {item?.versions.map((version, index) => (
                                                                    version?.active && (
                                                                        <tr key={version?.id} className='custom-table'>
                                                                            <td>{index + 1}</td>
                                                                            <td>{version?.id}</td>
                                                                            <td>{version?.versionName}</td>
                                                                            <td className='w-15' style={{ minHeight: '40px' }}>
                                                                                {version?.image ? (
                                                                                    <div style={{ maxWidth: '100px' }} className=''>
                                                                                        <div key={index + 1} className='d-flex justify-content-center'>
                                                                                            <img
                                                                                                src={`${version?.image?.name}`}
                                                                                                alt={`${version?.id}-image`}
                                                                                                style={{ maxHeight: '100px', width: 'auto' }}
                                                                                            />
                                                                                        </div>
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
                                                                    )
                                                                ))}
                                                            </tbody>
                                                        </Table>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={6}>
                                                    <div className='d-flex justify-content-end'>
                                                        <div className='d-flex justify-content-between' style={{ minWidth: '250px' }}>
                                                            <CustomButton btnName={'Change infomation'} btnBG={'warning'} textColor={'text-white'}
                                                                btnType={'button'} handleClick={() => { handleSetSelectedProduct(item) }} />
                                                            <CustomButton btnName={'Remove'} btnBG={'danger'} textColor={'text-white'}
                                                                btnType={'button'} handleClick={() => { handleRemoveProduct(item?.id) }} />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    )}

                                </React.Fragment>
                            ))}
                        </tbody>
                    </Table>
                    <div className='bg-body-tertiary d-flex justify-content-between align-items-center container pt-2'>
                        <p className='font-13'>{`${currentPage * 5 + 5 <= totalElements ? currentPage * 5 + 5 : totalElements} of ${totalElements} `}
                            <span><a href='#' className='text-decoration-none fw-medium'>{`View all >`}</a></span>
                        </p>
                        <Pagination className='border-0'>
                            <Pagination.First onClick={() => handleSetPage(0)}>{`<`}</Pagination.First>
                            {paginationItems}
                            <Pagination.Last onClick={() => handleSetPage(totalPage - 1)}>{`>`}</Pagination.Last>
                        </Pagination>
                    </div>
                </div>
                <div>
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
}

export default ProductTable;

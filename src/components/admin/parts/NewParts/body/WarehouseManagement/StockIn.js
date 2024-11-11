import React, { useEffect, useRef, useState } from 'react';
import { BsFillHouseAddFill } from "react-icons/bs";
import CustomButton from '../../component/CustomButton';
import Select from 'react-select';
import NotSelectYet from '../../component/errorPages/NotSelectYet';
import axiosInstance from '../../../../../../services/axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import { Form, InputGroup, Table } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import { useForm } from 'react-hook-form';

const StockIn = () => {
    const [suppliers, setSuppliers] = useState([]);
    useEffect(
        () => {
            axiosInstance.get('/staff/suppliers/all').then(
                (response) => {
                    if (response?.data?.errorCode === 200) {
                        setSuppliers(response?.data?.data)
                    } else {
                        toast.error('Failed to get supplier. Please check for errors and try again !');
                    }
                }
            );
        }, []
    );

    const supplierOptions = suppliers.map(item => ({
        value: item?.supplierId,
        label: item?.supplierName,
    }));

    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const supplierRef = useRef();
    const handleGetSupplier = (selectedOption) => {
        const matchSupplier = suppliers.find(item => item?.supplierId === selectedOption?.value);
        if (matchSupplier) {
            setSelectedSupplier(matchSupplier);
        }
    }

    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    useEffect(
        () => {
            axiosInstance.get(`/staff/product?page=${currentPage + 1}&size=5`).then(
                (response) => {
                    if (response?.data?.code === 200) {
                        setProducts(response?.data?.data?.content);
                        setTotalPage(response?.data?.data?.totalPages);
                    } else {
                        toast.error('Failed to get product. Please check for errors and try again !');
                    }
                }
            );
        }, [currentPage]
    );

    const nextPageProduct = () => {
        if (currentPage + 1 < totalPage) {
            setCurrentPage(currentPage + 1);
        } else {
            toast.warning('Last product page.')
        }
    }

    const previousPageProduct = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        } else {
            toast.warning('First product page.')
        }
    }

    const [selectedProduct, setSelectedProduct] = useState(null);

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    const { setValue, getValues, setError, formState: { errors }, register, trigger, reset } = useForm();

    const getDate = () => {
        const now = new Date();
        const dd = String(now.getDate()).padStart(2, '0');
        const MM = String(now.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 nên phải cộng thêm 1
        const yy = String(now.getFullYear()).slice(-2); // Lấy 2 số cuối của năm
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');

        return `${dd}${MM}${yy}-${hh}${mm}${ss}`;
    };

    const handleSubmit = async () => {
        if (selectedSupplier) {
            setValue('supplierId', selectedSupplier?.supplierId);
        } else {
            setError('supplier', { type: 'manual', message: 'Supplier is required!' })
        }

        const productQuantityFields = products.map((_, index) => `productVersions[${index}].quantity`);
        let isValid = await trigger([
            ...productQuantityFields,
            'supplierId'
        ]);

        if (isValid) {
            console.log('value: ', getValues());
            setValue('description', `receipt-prod${selectedProduct?.id}-${getDate()}`);
            axiosInstance.post('/staff/receipt', getValues()).then(
                (response) => {
                    if (response?.data?.errorCode === 200) {
                        toast.success('Receipt create successfully');
                        setSelectedProduct(null);
                        setSelectedSupplier(null);
                        reset();
                    } else {
                        toast.error(`Failed to create receipt. Please check for errors and try again !!`);
                    }
                }
            )
        }
    }

    return (
        <div className='mt-2'>
            <div className='container'>
                <div className='mb-4 d-flex justify-content-between align-items-center'>
                    <div>
                        <h4 className='fw-bold d-flex align-items-center'><BsFillHouseAddFill />&ensp;Stock in</h4>
                        <p className='fw-medium'>Stock in products</p>
                    </div>
                    <div>
                        <CustomButton btnBG={'primary'} btnName={'STOCK!'} handleClick={handleSubmit} />
                    </div>
                </div>
                <div className='mt-2 d-flex'>
                    <div className='col-9 pe-3'>
                        <div className='me-2'>
                            <div className='row bg-white border rounded-1' style={{ minHeight: '450px' }}>
                                {selectedProduct ? (
                                    <div>
                                        <h3>{`Product: ${selectedProduct?.productName}`}</h3>
                                        <Table striped>
                                            <tbody>
                                                {selectedProduct?.versions.map(
                                                    (item, index) => (
                                                        <tr className='custom-table'>
                                                            <td>
                                                                <div style={{ maxWidth: '100px' }} className=''>
                                                                    <div key={index + 1} className='d-flex justify-content-center'>
                                                                        <img
                                                                            src={`${item?.image?.name}`}
                                                                            alt={`${item?.versionName}`}
                                                                            style={{ maxHeight: '70px', width: 'auto' }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>{item?.versionName}</td>
                                                            <td>
                                                                <Form.Control type='hidden' value={item?.id}
                                                                    {...register(`productVersions[${index}].productVersionId`)} />
                                                                <Form.Control type='number' min={1} step={10} placeholder='Quantity. . .'
                                                                    {...register(`productVersions[${index}].quantity`, {
                                                                        required: "Quantity is required",
                                                                        min: { value: 1, message: "Must be at least 1 !" }
                                                                    })} />
                                                                {errors.productVersions?.[index]?.quantity &&
                                                                    <p className='text-danger fw-medium'>{errors.productVersions[index].quantity.message}</p>}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>
                                ) : ''}
                            </div>
                            <div className='mt-2 mb-3 row bg-white border rounded-1' style={{ minHeight: '350px' }}>
                                <div className='mt-1' style={{ minHeight: '50px', width: '100%' }}>
                                    <div className='d-flex justify-content-around'>
                                        <CustomButton btnBG={'warning'} textColor={'text-white'} btnName={"<"} handleClick={previousPageProduct} />
                                        <InputGroup className='w-30'>
                                            <InputGroup.Text className='custom-radius'><FaSearch /></InputGroup.Text>
                                            <Form.Control className='custom-radius' placeholder='Search produuct . . .' />
                                        </InputGroup>
                                        <CustomButton btnBG={'warning'} textColor={'text-white'} btnName={">"} handleClick={nextPageProduct} />
                                    </div>
                                    <div className='mt-4 d-flex'>
                                        {products?.map((product, index) => (
                                            <motion.div key={index} className='col' whileHover={{ opacity: 0.6 }} onClick={() => { setSelectedProduct(product) }}>
                                                <div style={{ minHeight: '200px' }}>
                                                    <img src={product?.image} alt={product?.name} style={{ maxWidth: '120px' }} />
                                                </div>
                                                <h6>{product?.productName}</h6>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-3'>
                        <div style={{ minHeight: '150px', maxWidth: '500px' }}>
                            <p className='fs-4 fw-medium mb-1'>Product's supplier</p>
                            <div className=''>
                                <Select options={supplierOptions} placeholder={`Select supplier. . .`} onChange={handleGetSupplier} />
                                <p className='text-danger fw-medium'>{errors?.supplier && errors?.supplier?.message}</p>
                                {selectedSupplier ? (
                                    <div className='border rounded-2 px-2 pt-1 mt-1 bg-white' style={{ minHeight: '150px' }}>
                                        <p>{`Supplier's name: ${selectedSupplier?.supplierName}`}</p>
                                        <p>{`Contacter: ${selectedSupplier?.contactName}`}</p>
                                        <p>{`Address: ${selectedSupplier?.address}`}</p>
                                        <p>{`Phone number: ${selectedSupplier?.phone}`}</p>
                                        <p>{`Email: ${selectedSupplier?.email}`}</p>
                                    </div>
                                ) : (
                                    <div className='border rounded-2 px-2 mt-1 bg-white d-flex justify-content-center align-items-center'
                                        style={{ minHeight: '150px' }}>

                                        <NotSelectYet text={`You haven't select supplier yet !`} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <ToastContainer />
            </div>
        </div>
    );
}

export default StockIn;

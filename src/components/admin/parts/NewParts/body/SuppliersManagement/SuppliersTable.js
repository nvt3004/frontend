import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup, Pagination, Table } from 'react-bootstrap';
import { FaEye, FaFileExport, FaPlus, FaSearch } from 'react-icons/fa';
// import suppliers from './data';
import { FaParachuteBox } from "react-icons/fa";
import SupplierModal from './SupplierModal';
import DoRequest from '../../../../axiosRequest/doRequest';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import CustomButton from '../../component/CustomButton';
import { FaTrashAlt } from "react-icons/fa";
import Swal from 'sweetalert2';
import axiosInstance from '../../../../../../services/axiosConfig';

const SuppliersTable = () => {

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
        setEdit(false);
        setSelectedSupplier(null);
    }
    const handleCancel = () => {
        handleCloseModal();
        reset();
    }
    const handleEdit = (e) => {
        e.preventDefault();
        setEdit(true);
    }
    const handleChange = (e) => {
        if (!isEdit && !isNew) {
            e.preventDefault();
        }
    }
    const handleNew = () => {
        setNew(true);
        handleShowModal();
    }

    const [suppliers, setSuppliers] = useState(null);
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [keyword, setKeyword] = useState('');
    const [size, setSize] = useState(10);

    const handleGetSuppliersAPI = () => {
        axiosInstance.get(`/staff/suppliers?size=${size}&page=${currentPage}&status=true&keyword=${keyword}`).then(
            (response) => {
                const sortedSuppliers = response?.data?.data?.content;
                setSuppliers(sortedSuppliers);
                setTotalPage(response?.data?.data?.totalPages);
                setTotalElements(response?.data?.data?.totalElements);
            }
        );
    }
    const handleSetPage = (page) => {
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    }
    const paginationItems = [];
    for (let number = 0; number < totalPage; number++) {
        paginationItems.push(
            <Pagination.Item key={number} active={number === currentPage}
                onClick={() => handleSetPage(number)}>
                {number + 1}
            </Pagination.Item>
        );
    }
    useEffect(
        () => {
            handleGetSuppliersAPI();
        }, [currentPage, isEdit, isNew, keyword]
    );
    useEffect(
        () => {
            console.log('supplier list: ', suppliers);

        }, [suppliers]
    )

    const { register, formState: { errors }, setValue, reset, getValues, trigger } = useForm();

    const doHandleSubmit = async (e) => {
        e.preventDefault();

        if (errors) {
            console.log(errors);
        }

        console.log(getValues());
        let isValid = await trigger([
            'contactName',
            'supplierName',
            'address',
            'email',
            'phone',
        ]);

        console.log('is valid: ' + isValid);
        setValue('isActive', true);
        const supplier = getValues();
        if (!isValid) {
            toast.error('Biểu mẫu không đúng !!');
        } else {
            axiosInstance.put(`/staff/suppliers?id=${supplier?.id}`, supplier).then(
                (response) => {
                    if (response?.data?.errorCode === 200) {
                        toast.success(`Cập nhật thành công !!`);
                        handleCancel();
                    } else {
                        toast.error(`Không thể thực thi công việc. Vui lòng thử lại !!`);
                    }
                }
            );
        }
    };

    const doHandleSubmitNew = async (e) => {
        e.preventDefault();

        if (errors) {
            console.log(errors);
        }

        console.log(getValues());
        let isValid = await trigger([
            'contactName',
            'supplierName',
            'address',
            'email',
            'phone'
        ]);

        console.log('is valid: ' + isValid);
        setValue('isActive', true);
        const supplier = getValues();
        if (!isValid) {
            toast.error('Biểu mẫu không đúng !!');
        } else {
            axiosInstance.post(`/staff/suppliers`, supplier).then(
                (response) => {
                    console.log(response);

                    if (response?.data?.errorCode === 200 || response?.data?.errorCode === 201) {
                        toast.success(`Thêm mới thành công !!`);
                        handleCancel();
                    } else {
                        toast.error(`Không thể thực thi công việc. Vui lòng thử lại !!`);
                    }
                }
            );
        }
    }

    const handleRemoveSupplier = (id) => {
        Swal.fire(
            {
                title: 'Bạn muốn xóa bỏ nhà cung cấp này ?',
                text: 'Bạn có thể sẽ không khôi phục lại được',
                icon: 'question',
                showCancelButton: true,
                showConfirmButton: true,
                cancelButtonText: 'Hủy bỏ',
                confirmButtonText: `OK`,
            }
        ).then(
            (result) => {
                if (result?.isConfirmed) {
                    axiosInstance.delete(`/staff/suppliers?id=${id}`).then(
                        (response) => {
                            if (response?.data?.errorCode === 200 || response?.data?.errorCode === 201) {
                                toast.success(`Xóa thành công !!`);
                                handleGetSuppliersAPI();
                            } else {
                                toast.error(`Không thể thực thi công việc. Vui lòng thử lại !!`);
                            }
                        }
                    );
                }
            }
        );
    }

    useEffect(
        () => {
            if (selectedSupplier) {
                setValue("id", selectedSupplier?.supplierId);
            }
        }, [selectedSupplier]
    );

    return (
        <div className='font-14'>
            <div className='bg-body-tertiary d-flex align-items-center' style={{ height: "50px" }}>
                <div className='container d-flex justify-content-between align-items-center'>
                    <h4 className='m-0 col-2 d-flex align-items-center'><FaParachuteBox />&ensp;Nhà cung cấp</h4>
                    <div className='col-10 d-flex justify-content-around'>
                        <InputGroup className='w-30' style={{maxWidth: '450px'}}>
                            <InputGroup.Text className='custom-radius'><FaSearch /></InputGroup.Text>
                            <Form.Control className='custom-radius' placeholder='Tìm kiếm nhà cung cấp . . .' onChange={(e) => {setKeyword(e.currentTarget.value)}}/>
                        </InputGroup>
                        <Button variant='secondary' className='font-14 custom-radius custom-hover mx-2'><FaFileExport /> {` Xuất`}</Button>
                        <Button className='font-14 custom-radius custom-hover mx-2' onClick={() => handleShowModal()}><FaPlus />{` Thêm mới`}</Button>
                    </div>
                </div>
            </div>
            <div className=''>
                <Table className='mb-0' variant='' hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Người liên hệ</th>
                            <th>Nhà cung cấp</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Địa chỉ</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers?.map((item, index) => (
                            <tr key={index} className='font-13 custom-table'>
                                <td>{index + 1}</td>
                                <td>{item?.contactName}</td>
                                <td className='fw-medium'>
                                    {` ${item?.supplierName}`}
                                </td>
                                <td>{item?.email}</td>
                                <td className='fw-medium'>{item?.phone}</td>
                                <td>{item?.address}</td>
                                <td className='font-16'><FaEye className='eye-show' onClick={() => handleShowModal(item)} /></td>
                                <td>
                                    <CustomButton btnBG={'danger'} btnName={<FaTrashAlt />} handleClick={() => handleRemoveSupplier(item?.supplierId)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div className='bg-body-tertiary d-flex justify-content-between align-items-center container pt-2'>
                    <p className='font-13'>{`${(currentPage + 1) * 10 <= totalElements ? (currentPage + 1) * 10 : totalElements} / ${totalElements} `}
                        <span className='text-decoration-none fw-medium text-primary' onClick={() => {setSize(totalElements)}}>{`Xem tất cả >`}</span>
                    </p>
                    {totalPage > 1 && (
                        <Pagination className='border-0'>
                            <Pagination.First>{`<`}</Pagination.First>
                            {paginationItems}
                            <Pagination.Last>{`>`}</Pagination.Last>
                        </Pagination>
                    )}
                </div>
            </div>

            <div>
                <SupplierModal supplier={selectedSupplier} show={showModal} handleClose={handleCloseModal} isNew={isNew}
                    isEdit={isEdit} handelEdit={handleEdit} handleCancel={handleCancel} handleChange={handleChange}
                    register={register} handleSubmit={doHandleSubmit} errors={errors} handleSubmitNew={doHandleSubmitNew} />
                <ToastContainer />
            </div>
        </div>
    );
}

export default SuppliersTable;

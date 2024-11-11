import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup, Table } from 'react-bootstrap';
import { FaClipboardList, FaSearch, FaFileExport } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import axiosInstance from '../../../../../../services/axiosConfig';
import CustomButton from '../../component/CustomButton';
import { TbTrashXFilled } from "react-icons/tb";
import { MdModeEdit } from "react-icons/md";
import Select from 'react-select'
import Swal from 'sweetalert2';
import { CiEdit } from "react-icons/ci";

const OrderTable = () => {
    // START GET orders
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const handleGetOrderAPI = () => {
        axiosInstance.get(`/staff/orders?page=${currentPage}&size=5`).then(
            (response) => {
                if (response?.data?.errorCode === 200) {
                    setOrders(response?.data?.data?.content);
                    setTotalPage(response?.data?.data?.totalPages);
                    setTotalElements(response?.data?.data?.totalElements);
                } else {
                    toast.error('Could not get order list. Please try again !');
                }
            }
        );
    }
    useEffect(
        () => {
            handleGetOrderAPI();
        }, []
    );
    useEffect(
        () => {
            if (orders?.length !== 0) {
                console.log('orders list: ', orders);
            }
        }, [orders]
    )
    // END GET orders

    // START GET status
    const [selectedStatusOption, setSelectedStatusOption] = useState(null);
    const customReactSelectOrderStatusOptionsStyles = {
        option: (provided, { data, isFocused, isSelected }) => ({
            ...provided,
            backgroundColor: isSelected
                ? data.color || '#E0E0E0' // Màu nền khi được chọn, xám nếu không có
                : isFocused
                    ? `${data.color || '#E0E0E0'}99`  // Màu nhạt hơn khi hover
                    : '#fff',                         // Mặc định là trắng nếu không được chọn hoặc hover
            color: '#000', // Màu chữ khi chọn hoặc hover
            cursor: 'pointer'
        }),
        singleValue: (provided, { data }) => ({
            ...provided,
            backgroundColor: data.color || '#E0E0E0', // Màu nền cho giá trị đã chọn
            color: '#000',      // Màu chữ trắng nếu có màu nền, đen nếu không
            padding: '2px 8px',
            borderRadius: '4px'
        }),
    };

    const [orderStatus, setOrderStatus] = useState([]);
    useEffect(
        () => {
            axiosInstance.get('/staff/orders/statuses').then(
                (response) => {
                    if (response.data?.errorCode === 200) {
                        let status = response?.data?.data.map(item => {
                            let color;
                            // Loại bỏ khoảng trắng và chuyển về chữ thường cho statusName
                            switch (item.statusName.trim().toLowerCase()) {
                                case "pending":
                                    color = "#FFFF33"; // Vàng
                                    break;
                                case "processed":
                                    color = "#FF9933"; // Cam
                                    break;
                                case "shipped":
                                    color = "#3399FF"; // Xanh dương nhạt
                                    break;
                                case "delivered":
                                    color = "#33FF33"; // Xanh lá
                                    break;
                                case "cancelled":
                                    color = "#FF3333"; // Đỏ
                                    break;
                                default:
                                    color = "#E0E0E0"; // Xám cho Temp hoặc trạng thái không xác định
                            }
                            return {
                                value: item.statusId,
                                label: item.statusName,
                                color: color
                            };
                        });
                        setOrderStatus(status);
                    } else {
                        toast.error('Could not get the statuses. Please try again!');
                    }
                }
            )
        }, []
    );
    // END GET status

    // START HANDLE order
    const [orderID, setOrderID] = useState({
        isOpen: false,
        value: 0
    });
    const [orderDetails, setOrderDetails] = useState(null);
    const handleGetOrderDetail = () => {
        axiosInstance.get(`/staff/orders/${orderID?.value}`).then(
            (response) => {
                if (response?.data?.errorCode === 200) {
                    setOrderDetails(response?.data?.data?.orderDetail);
                } else {
                    toast.error('Could not get details of order. Please try again !');
                }
            }
        );
    };
    useEffect(() => {
        if (orderID.isOpen && orderID.value) {
            handleGetOrderDetail();
            console.log('is open: ', orderID?.isOpen);
            console.log('value: ', orderID?.value);
        } else {
            console.log('is open: ', orderID?.isOpen);
        }
    }, [orderID.isOpen, orderID.value]);
    const handleChangeStatus = (option, orderID) => {
        if ((option?.value < 4)) {
            Swal.fire(
                {
                    title: 'Confirm to change status',
                    text: 'Do youu want to change the status of this order ?',
                    icon: 'question',
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'OK!',
                    cancelButtonText: 'Cancel'
                }
            ).then(
                (result) => {
                    if (result.isConfirmed) {
                        axiosInstance.put(`/staff/orders/update-status?orderId=${orderID}&statusId=${option?.value}`).then(
                            (response) => {
                                if (response.data?.errorCode === 200) {
                                    toast.success('Updated order status successfully !');
                                    handleGetOrderAPI();
                                } else {
                                    toast.error('Could not update status of the order. Please try again !');
                                }
                            }
                        )
                    }
                }
            );
        } else {
            toast.warning(`You can not to set the status to ${option?.label.toLowerCase()}`)
        }
    }
    // END HANDLE order
    return (
        <div>
            <div className='font-14'>
                <div className='bg-body-tertiary d-flex align-items-center' style={{ height: "50px" }}>
                    <div className='container d-flex justify-content-between align-items-center'>
                        <h4 className='m-0 col-2 d-flex align-items-center'><FaClipboardList />&ensp;Orders</h4>
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
                <div>
                    <Table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th className=''>Customer</th>
                                <th>Address</th>
                                <th>Phone</th>
                                <th>Order date</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orders?.map(
                                    (order) => (
                                        <React.Fragment key={order?.orderId}>
                                            <tr className='custom-table'>
                                                <td>
                                                    {order?.orderId}
                                                </td>
                                                <td>
                                                    {order?.fullname}
                                                </td>
                                                <td>
                                                    {order?.address}
                                                </td>
                                                <td>
                                                    {order?.phone ||
                                                        (
                                                            <p className='px-2 py-1 bg-danger-subtle text-center rounded-3 me-1'>Missing</p>
                                                        )
                                                    }
                                                </td>
                                                <td>
                                                    {order?.orderDate}
                                                </td>
                                                <td style={{ width: '200px' }}>
                                                    <Select options={orderStatus}
                                                        value={
                                                            orderStatus.find(option => option.label === order?.statusName)
                                                        }
                                                        styles={customReactSelectOrderStatusOptionsStyles}
                                                        onChange={(option) => handleChangeStatus(option, order?.orderId)}
                                                    />
                                                </td>
                                                <td>
                                                    <CustomButton btnBG={'secondary'} btnName={'Details'} textColor={'text-light'}
                                                        handleClick={() => { setOrderID({ isOpen: !orderID?.isOpen, value: order?.orderId }) }} />
                                                </td>
                                            </tr>
                                            {(orderID?.value === order?.orderId && orderDetails) &&
                                                (
                                                    <tr>
                                                        <td colSpan={7}>
                                                            <Table>
                                                                <tbody>

                                                                </tbody>
                                                            </Table>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        </React.Fragment>
                                    )
                                )
                            }
                        </tbody>
                    </Table>
                </div>
            </div>
            <div>
                <ToastContainer />
            </div>
        </div>
    );
}

export default OrderTable;

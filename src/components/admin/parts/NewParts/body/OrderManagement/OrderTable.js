import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup, Pagination, Table } from 'react-bootstrap';
import { FaClipboardList, FaSearch, FaFileExport } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import axiosInstance from '../../../../../../services/axiosConfig';
import CustomButton from '../../component/CustomButton';
import Select from 'react-select'
import Swal from 'sweetalert2';
import { MdModeEdit } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import { HiCheck } from 'react-icons/hi';
import { ImCancelCircle } from 'react-icons/im';

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
                    const sortedOrders = response.data.data.content.sort((a, b) => b.orderId - a.orderId);

                    setOrders(sortedOrders);
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
        }, [currentPage]
    );
    useEffect(
        () => {
            if (orders?.length !== 0) {
                console.log('orders list: ', orders);
            }
        }, [orders]
    )
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
    // END GET orders

    // START GET status
    const customReactSelectOrderStatusOptionsStyles = {
        option: (provided, { data, isFocused, isSelected }) => ({
            ...provided,
            backgroundColor: isSelected
                ? data.color || '#E0E0E0'
                : isFocused
                    ? `${data.color || '#E0E0E0'}99`
                    : '#fff',
            color: '#000',
            cursor: 'pointer'
        }),
        singleValue: (provided, { data }) => ({
            ...provided,
            backgroundColor: data.color || '#E0E0E0',
            color: '#000',
            padding: '2px 8px',
            borderRadius: '4px',
            opacity: 0.8,
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
    const [orderDetails, setOrderDetails] = useState(
        {
            orderId: '',
            orderDetail: [
                {
                    orderDetailId: '',
                    product: [
                        {
                            productID: '',
                            productName: '',
                            productVersionID: '',
                            productAttributes: {
                                colors: [
                                    {
                                        value: '',
                                        label: ''
                                    }
                                ],
                                sizes: [
                                    {
                                        value: '',
                                        label: ''
                                    }
                                ]
                            },
                            orderVersionnAttribute: {
                                color: {
                                    value: '',
                                    label: ''
                                },
                                size: {
                                    value: '',
                                    label: ''
                                },
                            }

                        }
                    ]
                }
            ]
        }
    );
    const handleGetOrderDetail = () => {
        axiosInstance.get(`/staff/orders/${orderID?.value}`).then(
            (response) => {
                if (response?.data?.errorCode === 200) {
                    const temp = response?.data?.data?.orderDetail[0];
                    console.log("temp:", temp);
                    console.log("temp.productDetails:", temp?.productDetails);

                    if (temp?.productDetails.length > 0) {

                    }
                    setOrderDetails({
                        orderId: temp?.orderId,
                        orderDetail: temp?.productDetails.map((item) => ({
                            orderDetailId: item.orderDetailId,
                            product: [
                                {
                                    productID: item.productId,
                                    productName: item?.productName,
                                    productVersionID: item.productVersionId,
                                    productAttributes: {
                                        colors: item.attributeProducts && item.attributeProducts[0] && item.attributeProducts[0].colors
                                            ? Array.from(
                                                new Set(item.attributeProducts[0].colors.map(color => color.colorId))
                                            ).map(uniqueColorId => {
                                                return item.attributeProducts[0].colors.find(color => color.colorId === uniqueColorId);
                                            }).map(color => ({
                                                value: color.colorId,
                                                label: color.color
                                            }))
                                            : [],

                                        sizes: item.attributeProducts && item.attributeProducts[0] && item.attributeProducts[0].sizes
                                            ? Array.from(
                                                new Set(item.attributeProducts[0].sizes.map(size => size.sizeId))
                                            ).map(uniqueSizeId => {
                                                return item.attributeProducts[0].sizes.find(size => size.sizeId === uniqueSizeId);
                                            }).map(size => ({
                                                value: size.sizeId,
                                                label: size.size
                                            }))
                                            : []
                                    },
                                    orderVersionAttribute: {
                                        color: {
                                            value: item.attributeProductVersion?.color?.colorId,
                                            label: item.attributeProductVersion?.color?.color,
                                        },
                                        size: {
                                            value: item.attributeProductVersion?.size?.sizeId,
                                            label: item.attributeProductVersion?.size?.size,
                                        }
                                    }
                                    ,
                                    price: item.price,
                                    quantity: item.quantity,
                                    imageUrl: item.imageUrl,
                                    description: item.description,
                                    total: item.total
                                }
                            ]
                        }))
                    });
                } else {
                    toast.error('Could not get details of order. Please try again!');
                }
            }
        ).catch(error => {
            console.error("Error fetching order details:", error);
            toast.error("An error occurred while fetching order details.");
        });
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

    const canChangeStatus = (currentStatus, newStatus) => {
        const validTransitions = {
            "pending": ["processed", "cancelled"],
            "processed": ["shipped"],
            "shipped": ["delivered"],
            "delivered": [],
            "cancelled": []
        };
        return validTransitions[currentStatus]?.includes(newStatus);
    };

    const handleChangeStatus = (option, orderID) => {
        const currentStatus = orders.find(order => order.orderId === orderID)?.statusName.toLowerCase();
        const newStatus = option?.label.toLowerCase();

        if (!canChangeStatus(currentStatus, newStatus)) {
            toast.warning(`Cannot change status from ${currentStatus} to ${newStatus}`);
            return;
        }

        Swal.fire({
            title: 'Confirm to change status',
            text: 'Do you want to change the status of this order?',
            icon: 'question',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'OK!',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosInstance.put(`/staff/orders/update-status?orderId=${orderID}&statusId=${option?.value}`).then(
                    (response) => {
                        if (response.data?.errorCode === 200) {
                            toast.success('Updated order status successfully!');
                            handleGetOrderAPI();
                        } else if (response.data?.errorCode === 400) {
                            toast.error(response.data?.message);
                        } else {
                            toast.error('Could not update status of the order. Please try again!');
                        }
                    }
                );
            }
        });
    };

    useEffect(
        () => {
            if (orderDetails) {
                console.log('order details: ', orderDetails);
            }
        }, [orderDetails]
    );

    const [isEditVersion, setEditVersion] = useState({ isEdit: '', orderDetailsID: '' });
    const handleSaveVersionChanges = (orderDetail) => {
        const { orderDetailId, product } = orderDetail;
        const { productID, orderVersionAttribute } = product[0];
        const colorId = orderVersionAttribute.color?.value;
        const sizeId = orderVersionAttribute.size?.value;

        if (!colorId || !sizeId) {
            toast.error("Please select both color and size.");
            return;
        }

        console.log("Selected colorId:", colorId);
        console.log("Selected sizeId:", sizeId);

        axiosInstance.put(`/staff/orders/update-order-detail?orderDetailId=${orderDetailId}&productId=${productID}&colorId=${colorId}&sizeId=${sizeId}`)
            .then((response) => {
                console.log("API Response:", response);
                if (response.data?.errorCode === 200) {
                    toast.success("Updated order detail successfully!");
                    handleGetOrderDetail();

                    setEditVersion({ isEdit: false, orderDetailsID: null });
                } else {
                    console.log("Error Response:", response.data);
                    toast.error(response.data?.errorMessage || "Could not update order detail. Please try again!");
                }
            })
            .catch((error) => {
                console.error("Error updating order detail:", error);
                toast.error("An error occurred while updating order detail.");
            });
    };

    const handleQuantityChange = (orderDetailId, currentQuantity, change) => {
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) {
            toast.error("Quantity cannot be less than 1.");
            return;
        }

        axiosInstance.put(`/staff/orders/update-order-detail-quantity?orderDetailId=${orderDetailId}&quantity=${newQuantity}`)
            .then((response) => {
                if (response.data?.errorCode === 200) {
                    toast.success("Updated quantity successfully!");
                    handleGetOrderDetail();
                } else {
                    toast.error(response.data?.errorMessage || "Could not update quantity. Please try again!");
                }
            })
            .catch((error) => {
                console.error("Error updating quantity:", error);
                toast.error("An error occurred while updating quantity.");
            });
    };

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
                                                    {
                                                        orderID?.isOpen && orderID?.value === order?.orderId ? (
                                                            <CustomButton btnBG={'secondary'} btnName={'Details'} textColor={'text-light'}
                                                                handleClick={() => { setOrderID({ isOpen: false, value: null }) }} />
                                                        ) : (
                                                            <CustomButton btnBG={'secondary'} btnName={'Details'} textColor={'text-light'}
                                                                handleClick={() => { setOrderID({ isOpen: true, value: order?.orderId }) }} />
                                                        )
                                                    }
                                                </td>
                                            </tr>
                                            {(orderID?.value === order?.orderId && orderDetails) &&
                                                (
                                                    <tr>
                                                        <td colSpan={7}>
                                                            <Table hover striped>
                                                                <thead>
                                                                    <th>#</th>
                                                                    <th style={{ width: '450px' }}>Product</th>
                                                                    <th style={{ width: '200px' }}></th>
                                                                    <th colSpan={2} className='text-center'>Attributes</th>
                                                                    <th>Unit price</th>
                                                                    <th>Quantity</th>
                                                                    <th>Total</th>
                                                                    <th colSpan={2}></th>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        orderDetails?.orderDetail?.map((orderDetail, index) => (
                                                                            orderDetail?.product.map((item) => (
                                                                                <tr key={index} className='custom-table'>
                                                                                    <td>{index + 1}</td>
                                                                                    <td>{item?.productName}</td>
                                                                                    <td className='d-flex justify-content-center'>
                                                                                        <img src={item?.imageUrl} alt={item?.productName} style={{ maxWidth: '120px', height: 'auto' }} />
                                                                                    </td>
                                                                                    {
                                                                                        isEditVersion.isEdit && isEditVersion.orderDetailsID === orderDetail.orderDetailId ? (
                                                                                            <React.Fragment>
                                                                                                <td>
                                                                                                    <Select
                                                                                                        options={item?.productAttributes?.colors}
                                                                                                        value={item?.orderVersionAttribute?.color}
                                                                                                        onChange={(selectedOption) => {
                                                                                                            setOrderDetails((prevOrderDetails) => {
                                                                                                                const updatedOrderDetails = { ...prevOrderDetails };
                                                                                                                const targetDetail = updatedOrderDetails.orderDetail.find(detail => detail.orderDetailId === orderDetail.orderDetailId);
                                                                                                                if (targetDetail) {
                                                                                                                    const targetProduct = targetDetail.product.find(p => p.productID === item.productID);
                                                                                                                    if (targetProduct) {
                                                                                                                        targetProduct.orderVersionAttribute.color = selectedOption;
                                                                                                                    }
                                                                                                                }
                                                                                                                return updatedOrderDetails;
                                                                                                            });
                                                                                                        }}
                                                                                                    />
                                                                                                </td>
                                                                                                <td>
                                                                                                    <Select
                                                                                                        options={item?.productAttributes?.sizes}
                                                                                                        value={item?.orderVersionAttribute?.size}
                                                                                                        onChange={(selectedOption) => {
                                                                                                            setOrderDetails((prevOrderDetails) => {
                                                                                                                const updatedOrderDetails = { ...prevOrderDetails };
                                                                                                                const targetDetail = updatedOrderDetails.orderDetail.find(detail => detail.orderDetailId === orderDetail.orderDetailId);
                                                                                                                if (targetDetail) {
                                                                                                                    const targetProduct = targetDetail.product.find(p => p.productID === item.productID);
                                                                                                                    if (targetProduct) {
                                                                                                                        targetProduct.orderVersionAttribute.size = selectedOption;
                                                                                                                    }
                                                                                                                }
                                                                                                                return updatedOrderDetails;
                                                                                                            });
                                                                                                        }}
                                                                                                    />
                                                                                                </td>
                                                                                            </React.Fragment>
                                                                                        ) : (
                                                                                            <React.Fragment>
                                                                                                <td>{item?.orderVersionAttribute?.color?.label}</td>
                                                                                                <td>{item?.orderVersionAttribute?.size?.label}</td>
                                                                                            </React.Fragment>
                                                                                        )
                                                                                    }
                                                                                    <td>{`${item?.price} VND`}</td>
                                                                                    <td>
                                                                                        {
                                                                                            order?.statusName === 'Pending' ? (
                                                                                                <div className='d-flex align-items-center'>
                                                                                                    <Button variant="secondary" size="sm" onClick={() => handleQuantityChange(orderDetail.orderDetailId, item.quantity, -1)}>
                                                                                                        -
                                                                                                    </Button>
                                                                                                    <span className="mx-2">{item?.quantity}</span>
                                                                                                    <Button variant="secondary" size="sm" onClick={() => handleQuantityChange(orderDetail.orderDetailId, item.quantity, 1)}>
                                                                                                        +
                                                                                                    </Button>
                                                                                                </div>
                                                                                            ) : (
                                                                                                item?.quantity
                                                                                            )
                                                                                        }
                                                                                    </td>
                                                                                    <td>{`${item?.total} VND`}</td>
                                                                                    {
                                                                                        order?.statusName === 'Pending' &&
                                                                                        (isEditVersion.isEdit && isEditVersion.orderDetailsID === orderDetail.orderDetailId ? (
                                                                                            <React.Fragment>
                                                                                                <td>
                                                                                                    <CustomButton
                                                                                                        btnBG={'success'}
                                                                                                        btnType={'button'}
                                                                                                        textColor={'text-white'}
                                                                                                        btnName={<HiCheck />}
                                                                                                        handleClick={() => handleSaveVersionChanges(orderDetail)}
                                                                                                    />
                                                                                                </td>
                                                                                                <td>
                                                                                                    <CustomButton
                                                                                                        btnBG={'danger'}
                                                                                                        btnType={'button'}
                                                                                                        textColor={'text-white'}
                                                                                                        btnName={<ImCancelCircle />}
                                                                                                        handleClick={() => setEditVersion({ isEdit: false, orderDetailsID: null })}
                                                                                                    />
                                                                                                </td>
                                                                                            </React.Fragment>
                                                                                        ) : (
                                                                                            <React.Fragment>
                                                                                                <td>
                                                                                                    <CustomButton btnBG={'danger'} btnType={'button'} textColor={'text-white'} btnName={<FaTrash />} />
                                                                                                </td>
                                                                                                <td>
                                                                                                    <CustomButton
                                                                                                        btnBG={'warning'}
                                                                                                        btnType={'button'}
                                                                                                        textColor={'text-white'}
                                                                                                        btnName={<MdModeEdit />}
                                                                                                        handleClick={() => setEditVersion({ isEdit: true, orderDetailsID: orderDetail.orderDetailId })}
                                                                                                    />
                                                                                                </td>
                                                                                            </React.Fragment>
                                                                                        ))
                                                                                    }
                                                                                </tr>
                                                                            ))
                                                                        ))
                                                                    }
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
                    <div className='bg-body-tertiary d-flex justify-content-between align-items-center container pt-2'>
                        <p className='font-13'>{`${(currentPage + 1) * 5 <= totalElements ? (currentPage + 1) * 5 : totalElements} of ${totalElements} `}
                            <span><a href='#' className='text-decoration-none fw-medium'>{`View all >`}</a></span>
                        </p>
                        <Pagination className='border-0'>
                            <Pagination.First>{`<`}</Pagination.First>
                            {paginationItems}
                            <Pagination.Last>{`>`}</Pagination.Last>
                        </Pagination>
                    </div>
                </div>
            </div>
            <div>
                <ToastContainer />
            </div>
        </div>
    );
}

export default OrderTable;

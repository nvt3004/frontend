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
import moment from 'moment';

const OrderTable = () => {
    // START GET orders
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [quantities, setQuantities] = useState({});
    const [isAdminOrder, setIsAdminOrder] = useState(null);
    const [keyword, setKeyword] = useState(null);
    const [statusId, setStatusId] = useState(null);
    const [statusOptions, setStatusOptions] = useState([]);
    const [pageSize, setPageSize] = useState(5);

    const handleGetOrderAPI = () => {
        console.log(isAdminOrder + " isAdminOrder");

        axiosInstance.get(`/staff/orders`, {
            params: {
                page: currentPage,
                size: pageSize,
                isAdminOrder: isAdminOrder !== null ? isAdminOrder : undefined,
                keyword: keyword || undefined,
                statusId: statusId || undefined,
            }
        }).then(
            (response) => {
                if (response?.data?.errorCode === 200) {
                    setOrders(response.data.data.content);
                    setTotalPage(response?.data?.data?.totalPages);
                    setTotalElements(response?.data?.data?.totalElements);
                }
                 else {
                    if (response?.data?.errorCode === 404) {
                        setOrders([]);
                        setTotalPage(0);
                        setTotalElements(0);
                    }
                    toast.error(response?.data?.message || 'Could not get order list. Please try again!');
                }
            }
        ).catch(error => {
            console.error("Error fetching orders:", error);
            toast.error(error.response?.data?.message || "An error occurred while fetching order list.");
        });
    };


    useEffect(() => {
        handleGetOrderAPI();
    }, [currentPage, isAdminOrder, statusId, pageSize]);

    const handleSetPage = (page) => {
        if (page !== currentPage) {
            setCurrentPage(page);
        }
    }

    useEffect(() => {
        if (currentPage >= totalPage) {
            setCurrentPage(0);
        }
    }, [totalPage]);

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
                    const initialQuantities = {};

                    const orderDetail = temp?.productDetails.map((item) => {
                        initialQuantities[`${item.orderDetailId}-${item.productId}`] = item.quantity;

                        return {
                            orderDetailId: item.orderDetailId,
                            product: [
                                {
                                    productID: item.productId,
                                    productName: item?.productVersionName,
                                    productVersionID: item.productVersionId,
                                    productAttributes: {
                                        colors: item.attributeProducts?.[0]?.colors
                                            ? Array.from(new Set(item.attributeProducts[0].colors.map(color => color.colorId)))
                                                .map(uniqueColorId => {
                                                    return item.attributeProducts[0].colors.find(color => color.colorId === uniqueColorId);
                                                })
                                                .map(color => ({
                                                    value: color.colorId,
                                                    label: color.color
                                                }))
                                            : [],
                                        sizes: item.attributeProducts?.[0]?.sizes
                                            ? Array.from(new Set(item.attributeProducts[0].sizes.map(size => size.sizeId)))
                                                .map(uniqueSizeId => {
                                                    return item.attributeProducts[0].sizes.find(size => size.sizeId === uniqueSizeId);
                                                })
                                                .map(size => ({
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
                                    },
                                    price: item.price,
                                    quantity: item.quantity,
                                    imageUrl: item.imageUrl,
                                    description: item.description,
                                    total: item.total
                                }
                            ]
                        };
                    });

                    setQuantities(initialQuantities);
                    setOrderDetails({
                        orderId: temp?.orderId,
                        orderDetail
                    });
                    console.log(orderID.isOpen + " orderID.isOpen");

                    setOrderID(prev => ({ ...prev, isOpen: true }));
                } else if (response?.data?.errorCode === 404) {
                    console.log(orderID.isOpen + " orderID.isOpen");
                    setOrderDetails(null);
                    setOrderID(prev => ({ ...prev, isOpen: false }));
                    toast.error(response.data?.message || 'Could not get details of order. Please try again!');
                } else {
                    toast.error(response.data?.message || 'Could not get details of order. Please try again!');
                }
            }
        ).catch(error => {
            console.error("Error fetching order details:", error);
            if (error?.response?.status === 404) {
                setOrderDetails(null);
                console.log(orderID.isOpen + " orderID.isOpen");
                setOrderID({ value: orderID.value, isOpen: false });

                toast.error(error?.response.data?.message || 'Could not get details of order. Please try again!');
            } else {
                toast.error(error?.response?.data?.message || "An error occurred while fetching order details.");
            }
        });
    };
    useEffect(() => {
        if (orderID.value) {
            handleGetOrderDetail();
        }
    }, [orderID.value]);

    const toggleOrderDetails = (order) => { setOrderID(prevState => ({ value: prevState.value === order?.orderId ? null : order?.orderId, isOpen: prevState.value !== order?.orderId })); };

    const handleChangeStatus = (option, orderID) => {
        if (option?.value < 4 || option?.value === 5) {
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
                    axiosInstance.put(`/staff/orders/update-status?orderId=${orderID}&statusId=${option?.value}`)
                        .then((response) => {
                            if (response.data?.errorCode === 200) {
                                toast.success('Updated order status successfully!');
                                handleGetOrderAPI();
                            } else {
                                toast.error(response.data?.message || 'Could not update status of the order. Please try again!');
                            }
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                            toast.error(error.response?.data?.message || error.message || 'Could not update status of the order. Please try again!');
                        });
                }
            });
        } else {
            toast.warning(`You cannot set the status to ${option?.label.toLowerCase()}`);
        }
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

    const handleQuantityChange = (orderDetailId, productID, currentQuantity, change) => {
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
                    setQuantities(prevQuantities => ({
                        ...prevQuantities,
                        [`${orderDetailId}-${productID}`]: newQuantity,
                    }));
                } else {
                    toast.error(response.data?.message || "Could not update quantity. Please try again!");
                }
            })
            .catch((error) => {
                console.error("Error updating quantity:", error);
                toast.error(error.response.data?.message || "An error occurred while updating quantity.");
            });
    };

    const handleQuantityInputChange = (orderDetailId, productID, newQuantity) => {
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [`${orderDetailId}-${productID}`]: newQuantity,
        }));
    };

    const handleQuantityInputBlur = (orderDetailId, productID, newQuantity) => {
        newQuantity = parseInt(newQuantity, 10);
        if (isNaN(newQuantity) || newQuantity < 1) {
            toast.error("Quantity must be a positive number.");
            return;
        }

        axiosInstance.put(`/staff/orders/update-order-detail-quantity?orderDetailId=${orderDetailId}&productID=${productID}&quantity=${newQuantity}`)
            .then(response => {
                if (response.data?.errorCode === 200) {
                    toast.success("Updated quantity successfully!");
                    setQuantities(prevQuantities => ({
                        ...prevQuantities,
                        [`${orderDetailId}-${productID}`]: newQuantity,
                    }));
                } else {
                    toast.error(response.data?.message || "Could not update quantity. Please try again!");
                }
            })
            .catch(error => {
                console.error("Error updating quantity:", error);
                toast.error(error.response?.data?.message || "An error occurred while updating quantity.");
            });
    };

    const handleKeyPress = (e, orderDetailId, productID, newQuantity) => {
        if (e.key === 'Enter') {
            handleQuantityInputBlur(orderDetailId, productID, newQuantity);
        }
    };

    const isAdminOrderOptions = [
        { value: true, label: 'Admin Orders' },
        { value: false, label: 'User Orders' },
        { value: null, label: 'All Orders' }
    ];

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const response = await axiosInstance.get('/staff/orders/statuses', {
                });

                if (response?.data?.errorCode === 200) {
                    const statuses = response.data.data;

                    const formattedOptions = statuses.map(status => ({
                        value: status.statusId,
                        label: status.statusName
                    }));
                    formattedOptions.unshift({
                        value: null,
                        label: 'All Statuses'
                    });

                    setStatusOptions(formattedOptions);
                }
            } catch (error) {
                console.error("Error fetching statuses:", error);
            }
        };

        fetchStatuses();
    }, []);

    const handleChange = (event, type) => {

        const value = event ? event.target ? event.target.value : event.value : null;
        setCurrentPage(0);

        switch (type) {
            case 'adminOrder':
                setIsAdminOrder(value);
                break;
            case 'status':
                setStatusId(value);
                break;
            case 'pageSize':
                setPageSize(value);
                break;
            default:
                break;
        }
    };

    const pageSizeOptions = [
        { value: 5, label: '5' },
        { value: 10, label: '10' },
        { value: 15, label: '15' },
        { value: 20, label: '20' }
    ];

    const handleExport = async () => {
        try {
            const response = await axiosInstance.get('/staff/orders/export', {
                params: {
                    page: currentPage,
                    size: pageSize,
                    isAdminOrder: isAdminOrder !== null ? isAdminOrder : undefined,
                    keyword: keyword || undefined,
                    statusId: statusId || undefined,
                },
                responseType: 'blob',  // Nhận dữ liệu dưới dạng file
            });

            // Tạo URL cho file Excel
            const fileURL = window.URL.createObjectURL(new Blob([response.data]));

            // Tạo một link tạm thời để tải file
            const link = document.createElement('a');
            link.href = fileURL;
            link.setAttribute('download', 'orders.xlsx');  // Tên file tải xuống
            document.body.appendChild(link);
            link.click();

            // Xóa link sau khi tải
            document.body.removeChild(link);
            handleGetOrderDetail();
            toast.success('Xuất file thành công');
        } catch (error) {
            console.error('Error exporting orders:', error);
            toast.error('There was an error exporting the orders.');
        }
    };

    const handleDeleteOrderDetail = async (orderId, orderDetailId) => {
        Swal.fire({
            title: 'Confirm Delete',
            text: 'Are you sure you want to delete this order detail?',
            icon: 'warning',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axiosInstance.delete(`/staff/orders/remove-orderdetail`, {
                        params: {
                            orderId,
                            orderDetailId
                        }
                    });

                    if (response.status === 200) {
                        toast.success("Order detail deleted successfully!");
                        handleGetOrderAPI();
                        handleGetOrderDetail();
                    } else {
                        toast.error(`Error: ${response.data.message}`);
                    }
                } catch (error) {
                    toast.error(`An error occurred: ${error.response?.data?.message || error.message}`);
                }
            }
        });
    };

    const handleKeywordChange = (e) => {
        setKeyword(e.target.value);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            handleGetOrderAPI();
        }, 500);
        return () => clearTimeout(timer);
    }, [keyword]);

    // END HANDLE order

    return (
        <div>
            <div className='font-14'>
                <div className='bg-body-tertiary d-flex align-items-center justify-content-between' style={{ height: "50px" }}>
                    <div className='container d-flex justify-content-between px-0'>
                        <div className='d-flex align-items-center justify-content-between' style={{ width: "45%" }}>
                            <h4 className='m-0 d-flex align-items-center'>
                                <FaClipboardList />&ensp;Orders
                            </h4>
                            <InputGroup className='mx-0' style={{ width: "400px" }}>
                                <InputGroup.Text className='custom-radius'><FaSearch /></InputGroup.Text>
                                <Form.Control
                                    className='custom-radius'
                                    placeholder='Search orders . . .'
                                    value={keyword}
                                    onChange={(e) => handleKeywordChange(e)}
                                />
                            </InputGroup>
                        </div>

                        <div className='d-flex justify-content-between align-items-center' style={{ width: "55%" }}>
                            <Select
                                className="w-20 mx-3"
                                options={isAdminOrderOptions}
                                placeholder="Admin Order"
                                onChange={(selectedOption) => handleChange(selectedOption, 'adminOrder')}
                                isClearable
                            />

                            <Select
                                className="w-20 mx-3"
                                options={statusOptions}
                                placeholder="Order Status"
                                onChange={(selectedOption) => handleChange(selectedOption, 'status')}
                                isClearable
                            />

                            <Select
                                className="w-20 mx-3"
                                options={pageSizeOptions}
                                placeholder="Page Size"
                                onChange={(selectedOption) => handleChange(selectedOption, 'pageSize')}
                                isClearable
                            />
                            <Button
                                variant="secondary"
                                className="font-14 custom-radius custom-hover mx-3"
                                onClick={handleExport}
                            >
                                <FaFileExport /> Export
                            </Button>
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

                            {orders.length === 0 ? (
                                <p>No orders found.</p>
                            ) : (
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
                                                <td> {moment(order?.orderDate).format('DD/MM/YYYY HH:mm')} </td>
                                                <td style={{ width: '200px' }}>
                                                    <Select options={orderStatus}
                                                        value={
                                                            orderStatus.find(option => option.label === order?.statusName)
                                                        }
                                                        styles={customReactSelectOrderStatusOptionsStyles}
                                                        onChange={(option) => handleChangeStatus(option, order?.orderId)}
                                                    />
                                                </td>

                                                {/* Bắt buộc phải call api để check xem có order detail không */}
                                                <td>
                                                    <CustomButton
                                                        btnBG={'secondary'}
                                                        btnName={'Details'}
                                                        textColor={'white'}
                                                        handleClick={() => toggleOrderDetails(order)}
                                                    />

                                                </td>
                                            </tr>
                                            {(orderID?.value === order?.orderId && orderID.isOpen && orderDetails) &&
                                                (
                                                    <tr>
                                                        <td colSpan={7}>
                                                            <Table hover striped>
                                                                <thead>
                                                                    <th>#</th>
                                                                    <th style={{ width: '100px' }}>Product</th>
                                                                    <th style={{ width: '150px' }}></th>
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
                                                                                    <td style={{
                                                                                        maxWidth: '150px',
                                                                                        overflow: 'hidden',
                                                                                        textOverflow: 'ellipsis',
                                                                                        whiteSpace: 'nowrap'
                                                                                    }}>
                                                                                        {item?.productName}
                                                                                    </td>

                                                                                    <td className='d-flex justify-content-center'>
                                                                                        <img
                                                                                            src={item?.imageUrl}
                                                                                            alt={item?.productName}
                                                                                            style={{
                                                                                                maxWidth: '120px',
                                                                                                maxHeight: '80px',
                                                                                                width: 'auto',
                                                                                                height: 'auto',
                                                                                                objectFit: 'contain' /* Giữ toàn bộ ảnh trong khung mà không bị cắt */
                                                                                            }}
                                                                                        />
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
                                                                                                    <Button variant="secondary" size="sm" onClick={() => handleQuantityChange(orderDetail.orderDetailId, item.productID, item.quantity, -1)}>
                                                                                                        -
                                                                                                    </Button>
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        className="mx-2"
                                                                                                        value={quantities[`${orderDetail.orderDetailId}-${item.productID}`] !== undefined ? quantities[`${orderDetail.orderDetailId}-${item.productID}`] : item.quantity}
                                                                                                        onChange={(e) => handleQuantityInputChange(orderDetail.orderDetailId, item.productID, e.target.value)}
                                                                                                        onBlur={(e) => handleQuantityInputBlur(orderDetail.orderDetailId, item.productID, e.target.value)}
                                                                                                        onKeyDown={(e) => handleKeyPress(e, orderDetail.orderDetailId, item.productID, e.target.value)}
                                                                                                        style={{ width: '50px', textAlign: 'center' }}
                                                                                                    />

                                                                                                    <Button variant="secondary" size="sm" onClick={() => handleQuantityChange(orderDetail.orderDetailId, item.productID, item.quantity, 1)}>
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
                                                                                                    <CustomButton
                                                                                                        btnBG={'danger'}
                                                                                                        btnType={'button'}
                                                                                                        textColor={'text-white'}
                                                                                                        btnName={<FaTrash />}
                                                                                                        handleClick={() => handleDeleteOrderDetail(order?.orderId, orderDetail?.orderDetailId)}
                                                                                                    />
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

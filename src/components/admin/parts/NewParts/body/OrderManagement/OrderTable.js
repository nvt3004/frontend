import React, { useEffect, useState, useRef } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Button, Form, InputGroup, Pagination, Table } from 'react-bootstrap';
import { FaClipboardList, FaSearch, FaFileExport, FaFileInvoice } from 'react-icons/fa';
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
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import printJS from 'print-js';
import Modal from 'react-modal';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import qz from 'qz-tray';
import { Link } from 'react-router-dom';
import JSEncrypt from 'jsencrypt';
// import fs from 'fs';
import CryptoJS from 'crypto-js'

const OrderTable = () => {
    // START GET orders
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [quantities, setQuantities] = useState({});
    const [keyword, setKeyword] = useState(null);
    const [statusId, setStatusId] = useState(null);
    const [statusOptions, setStatusOptions] = useState([]);
    const [pageSize, setPageSize] = useState(5);
    const [numberOfElements, setNumberOfElements] = useState(0);
    const navigate = useNavigate();

    const handleGetOrderAPI = () => {
        axiosInstance.get(`/staff/orders`, {
            params: {
                page: currentPage,
                size: pageSize,
                keyword: keyword || undefined,
                statusId: statusId || undefined,
            }
        }).then(
            (response) => {
                if (response?.data?.errorCode === 200) {
                    // Ánh xạ trạng thái tiếng Anh sang tiếng Việt
                    const ordersWithVietnameseStatus = response.data.data.content.map(order => {
                        const statusNameVietnamese = statusMapping[order.statusName] || order.statusName;
                        return {
                            ...order,
                            statusName: statusNameVietnamese
                        };
                    });

                    setOrders(ordersWithVietnameseStatus);
                    setTotalPage(response?.data?.data?.totalPages);
                    setTotalElements(response?.data?.data?.totalElements);
                    setNumberOfElements(response?.data?.data?.numberOfElements);
                } else if (response?.data?.errorCode === 404) {
                    setOrders([]);
                    setTotalPage(0);
                    setTotalElements(0);
                    setNumberOfElements(0);
                    toast.error(response?.data?.message || 'No orders found.');
                } else if (response?.data?.errorCode === 998) {
                    toast.error(response?.data?.message || 'You do not have permission to access the order list.');
                } else {
                    toast.error(response?.data?.message || 'Could not get order list. Please try again!');
                }
            }
        ).catch(error => {
            if (error.response?.status === 403) {
                toast.error("Session expired. Redirecting to login...");
                navigate('/auth/login');
            } else {
                console.error("Error fetching orders:", error);
                toast.error(error.response?.data?.message || "An error occurred while fetching order list.");
            }
        });
    };


    useEffect(() => {
        handleGetOrderAPI();
    }, [currentPage, statusId, pageSize]);

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

    const statusColorMapping = {
        Pending: "#FFFF33",
        Processed: "#FF9933",
        Shipped: "#3399FF",
        Delivered: "#33FF33",
        Cancelled: "#FF3333",
    };
    const statusMapping = {
        Pending: "Chờ xử lý",
        Processed: "Đã xử lý",
        Shipped: "Đã giao",
        Delivered: "Đã nhận",
        Cancelled: "Đã hủy"
    };

    useEffect(() => {
        axiosInstance.get('/staff/orders/statuses')
            .then((response) => {
                if (response.data?.errorCode === 200) {
                    let status = response?.data?.data.map(item => {
                        let color;
                        const statusNameEnglish = item.statusName.trim().toLowerCase();

                        // Ánh xạ tiếng Anh sang tiếng Việt
                        const statusNameVietnamese = statusMapping[item.statusName.trim()] || item.statusName;

                        switch (statusNameEnglish) {
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
                            label: statusNameVietnamese, // Hiển thị trạng thái tiếng Việt
                            color: color
                        };
                    });
                    setOrderStatus(status);
                } else if (response.data?.errorCode === 998) {
                    toast.error(response.data?.message || 'You do not have permission to access statuses.');
                } else {
                    toast.error('Could not get the statuses. Please try again!');
                }
            })
            .catch(error => {
                if (error.response?.status === 403) {
                    toast.error("Session expired. Redirecting to login...");
                    navigate('/auth/login');
                } else {
                    console.error("Error fetching statuses:", error);
                    toast.error(error.response?.data?.message || "An error occurred while fetching statuses.");
                }
            });
    }, [navigate]);


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
    const initialQuantitiesRef = useRef({});
    const handleGetOrderDetail = () => {
        axiosInstance.get(`/staff/orders/${orderID?.value}`)
            .then((response) => {
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
                                    productName: item?.productName,
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

                    initialQuantitiesRef.current = initialQuantities;
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
                } else if (response?.data?.errorCode === 998) {
                    toast.error(response.data?.message || 'You do not have permission to view this order.');
                } else {
                    toast.error(response.data?.message || 'Could not get details of order. Please try again!');
                }
            })
            .catch(error => {
                console.error("Error fetching order details:", error);
                if (error?.response?.status === 404) {
                    setOrderDetails(null);
                    console.log(orderID.isOpen + " orderID.isOpen");
                    setOrderID({ value: orderID.value, isOpen: false });

                    toast.error(error?.response.data?.message || 'Could not get details of order. Please try again!');
                } else if (error?.response?.status === 403) {
                    toast.error("Session expired. Redirecting to login...");
                    navigate('/auth/login');
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
        // if (option?.value < 4 || option?.value === 5) {
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
                        } else if (response.data?.errorCode === 998) {
                            toast.error(response.data?.message || "Bạn không có quyền thay đổi trạng thái đơn hàng này.");
                        } else {
                            toast.error(response.data?.message || 'Could not update status of the order. Please try again!');
                        }
                    })
                    .catch((error) => {
                        if (error?.response?.status === 403) {
                            toast.error("Session expired. Redirecting to login...");
                            navigate('/auth/login');
                        } else {
                            toast.error(error.response?.data?.message || error.message || 'Could not update status of the order. Please try again!');
                        }
                    });
            }
        });
        // } 
        // else {
        //     toast.warning(`You cannot set the status to ${option?.label.toLowerCase()}`);
        // }
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
                    handleGetOrderAPI();
                    setEditVersion({ isEdit: false, orderDetailsID: null });
                } else if (response.data?.errorCode === 998) {
                    console.log("Permission Denied:", response.data);
                    toast.error(response.data?.message || "Bạn không có quyền thực hiện hành động này.");
                } else {
                    console.log("Error Response:", response.data);
                    toast.error(response.data?.message || "Could not update order detail. Please try again!");
                }
            })
            .catch((error) => {
                console.error("Error updating order detail:", error);
                if (error?.response?.status === 403) {
                    toast.error("Session expired. Redirecting to login...");
                    navigate('/auth/login');
                } else {
                    toast.error(error?.response?.data?.message || "An error occurred while updating order detail.");
                }
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
                    setQuantities(prevQuantities => ({
                        ...prevQuantities,
                        [`${orderDetailId}-${productID}`]: newQuantity,
                    }));
                    handleGetOrderDetail();
                    handleGetOrderAPI();
                } else if (response.data?.errorCode === 998) {
                    toast.error(response.data?.message || "You do not have permission to update the quantity.");
                } else {
                    toast.error(response.data?.message || "Could not update quantity. Please try again!");
                }
            })
            .catch((error) => {
                console.error("Error updating quantity:", error);
                if (error?.response?.status === 403) {
                    toast.error("Session expired. Redirecting to login...");
                    navigate('/auth/login');
                } else {
                    toast.error(error.response?.data?.message || "An error occurred while updating quantity.");
                }
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
        const currentQuantity = initialQuantitiesRef.current[`${orderDetailId}-${productID}`];
        if (newQuantity === currentQuantity) {
            setQuantities(prevQuantities => ({
                ...prevQuantities,
                [`${orderDetailId}-${productID}`]: currentQuantity,
            }));
            return;
        }
        if (isNaN(newQuantity) || newQuantity < 1) {
            toast.error("Quantity must be a positive number.");
            setQuantities(prevQuantities => ({
                ...prevQuantities,
                [`${orderDetailId}-${productID}`]: initialQuantitiesRef.current[`${orderDetailId}-${productID}`],
            }));
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
                    initialQuantitiesRef.current[`${orderDetailId}-${productID}`] = newQuantity;
                    handleGetOrderDetail();
                    handleGetOrderAPI();
                } else if (response.data?.errorCode === 998) {
                    toast.error(response.data?.message || "Bạn không có quyền thực hiện hành động này.");
                    setQuantities(prevQuantities => ({
                        ...prevQuantities,
                        [`${orderDetailId}-${productID}`]: initialQuantitiesRef.current[`${orderDetailId}-${productID}`],
                    }));
                } else {
                    setQuantities(prevQuantities => ({
                        ...prevQuantities,
                        [`${orderDetailId}-${productID}`]: initialQuantitiesRef.current[`${orderDetailId}-${productID}`],
                    }));
                    toast.error(response.data?.message || "Could not update quantity. Please try again!");
                }
            })
            .catch(error => {
                setQuantities(prevQuantities => ({
                    ...prevQuantities,
                    [`${orderDetailId}-${productID}`]: initialQuantitiesRef.current[`${orderDetailId}-${productID}`],
                }));
                console.error("Error updating quantity:", error);
                if (error?.response?.status === 403) {
                    toast.error("Session expired. Redirecting to login...");
                    navigate('/auth/login');
                } else {
                    toast.error(error.response?.data?.message || "An error occurred while updating quantity.");
                }
            });
    };


    const handleKeyPress = (e, orderDetailId, productID, newQuantity) => {
        if (e.key === 'Enter') {
            handleQuantityInputBlur(orderDetailId, productID, newQuantity);
        }
    };

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const response = await axiosInstance.get('/staff/orders/statuses');

                if (response?.data?.errorCode === 200) {
                    const statuses = response.data.data;

                    const formattedOptions = statuses.map(status => {
                        const statusName = status.statusName.trim();
                        const statusNameVietnamese = statusMapping[statusName] || statusName;
                        const statusColor = statusColorMapping[statusName] || "#E0E0E0";

                        return {
                            value: status.statusId,
                            label: statusNameVietnamese,
                            color: statusColor
                        };
                    });

                    formattedOptions.unshift({
                        value: null,
                        label: 'Tất cả trạng thái',
                        color: "#74c2de"
                    });

                    setStatusOptions(formattedOptions);
                } else if (response?.data?.errorCode === 998) {
                    toast.error(response?.data?.message || "Bạn không có quyền thực hiện hành động này.");
                }
            } catch (error) {
                console.error("Error fetching statuses:", error);

                const errorCode = error?.response?.status || error.response?.data?.code;
                const errorMessage = error?.response?.data?.message || error.message;

                if (errorCode === 403) {
                    toast.error("Session expired. Redirecting to login...");
                    navigate('/auth/login');
                } else {
                    toast.error(errorMessage || "An error occurred while fetching statuses.");
                }
            }
        };

        fetchStatuses();
    }, [navigate]);

    const handleChange = (event, type) => {

        const value = event ? event.target ? event.target.value : event.value : null;
        setCurrentPage(0);
        switch (type) {
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
                    keyword: keyword || undefined,
                    statusId: statusId || undefined,
                },
                responseType: 'blob', // Nhận dữ liệu dưới dạng file
            });

            // Tạo URL cho file Excel
            const fileURL = window.URL.createObjectURL(new Blob([response.data]));

            // Tạo một link tạm thời để tải file
            const link = document.createElement('a');
            link.href = fileURL;
            link.setAttribute('download', 'orders.xlsx'); // Tên file tải xuống
            document.body.appendChild(link);
            link.click();

            // Xóa link sau khi tải
            document.body.removeChild(link);
            toast.success('Xuất file thành công');
        } catch (error) {
            console.error('Error exporting orders:', error);

            const errorCode = error?.response?.status || error.response?.data?.code;
            const errorMessage = error?.response?.data?.message || error.message;

            if (errorCode === 998) {
                toast.error(errorMessage || "Bạn không có quyền thực hiện hành động này.");
            } else if (errorCode === 403) {
                toast.error("Session expired. Redirecting to login...");
                navigate('/auth/login');
            } else {
                toast.error(errorMessage || 'Có lỗi xảy ra khi xuất đơn hàng.');
            }
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
                    console.error("Error deleting order detail:", error);

                    const errorCode = error?.response?.status || error.response?.data?.code;
                    const errorMessage = error?.response?.data?.message || error.message;

                    if (errorCode === 998) {
                        toast.error(errorMessage || "You do not have permission to perform this action.");
                    } else if (errorCode === 403) {
                        toast.error("Session expired. Redirecting to login...");
                        navigate('/auth/login');
                    } else {
                        toast.error(`An error occurred: ${errorMessage}`);
                    }
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

    const handleSelectChange = async (orderDetail, item, attribute, selectedOption) => {
        // Cập nhật giá trị mới vào state
        setOrderDetails((prevOrderDetails) => {
            const updatedOrderDetails = { ...prevOrderDetails };

            // Tìm orderDetail cần cập nhật
            const targetDetail = updatedOrderDetails.orderDetail.find(detail => detail.orderDetailId === orderDetail.orderDetailId);

            if (targetDetail) {
                // Tìm sản phẩm trong orderDetail
                const targetProduct = targetDetail.product.find(p => p.productID === item.productID);

                if (targetProduct) {
                    // Cập nhật thuộc tính của sản phẩm (color hoặc size)
                    targetProduct.orderVersionAttribute[attribute] = selectedOption;
                }
            }

            return updatedOrderDetails;
        });
    };

    const PUBLIC_CERTIFICATE = process.env.REACT_APP_PUBLIC_CERTIFICATE;
    const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;
    const [qzConnected, setQzConnected] = useState(false);
    let qzSocket = null;

    console.log(PUBLIC_CERTIFICATE + " PUBLIC_CERTIFICATE");
    console.log(PRIVATE_KEY + " PRIVATE_KEY");

    const connectToQz = async (options) => {
        try {
            qzSocket = await qz.websocket.connect(options);
            setQzConnected(true);
            console.log("Connected to QZ Tray");
            return qzSocket;
        } catch (error) {
            console.error("QZ Tray connection error:", error);
            qzSocket = null;
            setQzConnected(false);
            throw error;
        }
    };
    const disconnectFromQz = async () => {
        if (qzSocket && qz.websocket.isActive()) {
            try {
                await qzSocket.disconnect();
                qzSocket = null;
                setQzConnected(false);
                console.log("Disconnected from QZ Tray");
            } catch (error) {
                console.error("QZ Tray disconnection error:", error);
            }
        }
    };
    const printInvoice = async (orderId) => {
        try {
            const response = await axiosInstance.post(`/staff/orders/export?orderId=${orderId}`, {}, { responseType: 'blob' });
            // const imageUrl = response.data.data; 
            if (!response || !response.data) {
                throw new Error("No PDF data received from backend.");
            }

            const blob = new Blob([response.data], { type: 'application/pdf' });

            const reader = new FileReader();
            const base64Promise = new Promise((resolve, reject) => {
                reader.onloadend = () => resolve(reader.result.split(',')[1]); // Tách phần Base64
                reader.onerror = reject;
            });

            reader.readAsDataURL(blob);
            const base64data = await base64Promise;

            if (!qzConnected) {
                const options = {
                    host: 'https://stepstothefuture.store/',
                    port: {
                        secure: [8181, 8282, 8383, 8484],
                        insecure: [8182, 8283, 8384, 8485]
                    },
                    // usingSecure: true, 
                    allowUserInteraction: false,
                    usingSecure: false,
                    keepAlive: 60,
                    retries: 3,
                    delay: 5
                };

                console.log("Connecting to QZ Tray with options:", options);

                try {
                    await connectToQz(options);
                    setQzConnected(true);
                } catch (connectError) {
                    // Handle connection error
                    console.log("Connection error:", connectError);
                    setQzConnected(false);
                    throw connectError;
                }

                if (!qz.websocket.isActive()) {
                    throw new Error(`Failed to connect to QZ Tray`);
                }

                console.log("Connected to QZ Tray");
            }
            qz.security.setCertificatePromise(() => {
                return Promise.resolve(PUBLIC_CERTIFICATE);
            });

            qz.security.setSignaturePromise((toSign) => {
                return (resolve, reject) => {
                    try {
                        const rsa = new JSEncrypt();
                        rsa.setPrivateKey(PRIVATE_KEY);
                        resolve(rsa.sign(toSign, CryptoJS.SHA256, "sha256"));
                    } catch (err) {
                        reject(err);
                    }
                };
            });
            // console.log(imageUrl + " imageUrl");

            const printerName = 'XP-58';
            // const printerName = 'Microsoft Print to PDF';
            const printConfig = qz.configs.create(printerName);

            console.log("Printing with config:", printConfig);


            await qz.print(printConfig, [{ type: 'pdf', format: 'base64', data: base64data }]);

            // await qz.print(printConfig, [
            //     { type: 'raw', format: 'command', data: '\x1B\x69' } // Lệnh ESC/POS để cắt giấy
            // ]);

            await qz.print(printConfig, [
                { type: 'raw', format: 'command', data: '\x1B\x64\x01' } // Lệnh ESC/POS để cắt giấy
            ]);


            toast.success('Print successful and paper cut!');
        } catch (error) {
            toast.error(`Print error: ${error.message}`);
            setQzConnected(false);
        } finally {
            if (qzConnected) {
                try {
                    await disconnectFromQz();
                    console.log("Disconnected from QZ Tray");
                } catch (disconnectError) {
                    console.log("Disconnection error:", disconnectError);
                } finally {
                    await disconnectFromQz();
                }

            }

        }
    };

    const [selectedOrders, setSelectedOrders] = useState([]);
    const [allChecked, setAllChecked] = useState(false);


    const handlePrintSelected = () => {
        console.log(selectedOrders.length + " selectedOrders.length");
        if (selectedOrders.length === 0) {
            toast.info("No orders selected to print.");
            return;
        }


        printMultipleInvoices(selectedOrders);
    }

    const printMultipleInvoices = async (orderIds) => {
        try {
            if (!qzConnected) {
                const options = {
                    host: 'https://stepstothefuture.store/',
                    port: {
                        secure: [8181, 8282, 8383, 8484],
                        insecure: [8182, 8283, 8384, 8485]
                    },
                    allowUserInteraction: false,
                    usingSecure: false,
                    keepAlive: 60,
                    retries: 3,
                    delay: 5
                };

                console.log("Connecting to QZ Tray with options:", options);

                try {
                    await connectToQz(options);
                    setQzConnected(true);
                } catch (connectError) {
                    console.log("Connection error:", connectError);
                    setQzConnected(false);
                    throw connectError;
                }

                if (!qz.websocket.isActive()) {
                    throw new Error(`Failed to connect to QZ Tray`);
                }

                console.log("Connected to QZ Tray");
            }
            qz.security.setCertificatePromise(() => Promise.resolve(PUBLIC_CERTIFICATE));
            qz.security.setSignaturePromise((toSign) => (resolve, reject) => {
                try {
                    const rsa = new JSEncrypt();
                    rsa.setPrivateKey(PRIVATE_KEY);
                    resolve(rsa.sign(toSign, CryptoJS.SHA256, "sha256"));
                } catch (err) {
                    reject(err);
                }
            });

            const printerName = 'XP-58';
            // const printerName = 'Microsoft Print to PDF';
            const printConfig = qz.configs.create(printerName);

            for (const orderId of orderIds) {
                await printInvoice1(orderId, printConfig);
            }

            toast.success('All invoices printed successfully and paper cut!');
        } catch (error) {
            toast.error(`Print error: ${error.message}`);
        } finally {
            if (qzConnected) {
                try {
                    await disconnectFromQz();
                    console.log("Disconnected from QZ Tray");
                } catch (disconnectError) {
                    console.log("Disconnection error:", disconnectError);
                } finally {
                    await disconnectFromQz();
                }

            }

        }
    };

    const printInvoice1 = async (orderId, printConfig) => {
        try {
            const response = await axiosInstance.post(`/staff/orders/export?orderId=${orderId}`, {}, { responseType: 'blob' });

            if (!response || !response.data) {
                throw new Error("No image data received from backend.");
            }
            const blob = new Blob([response.data], { type: 'application/pdf' });

            const reader = new FileReader();
            const base64Promise = new Promise((resolve, reject) => {
                reader.onloadend = () => resolve(reader.result.split(',')[1]);
                reader.onerror = reject;
            });

            reader.readAsDataURL(blob);
            const base64data = await base64Promise;

            console.log("Printing with config:", printConfig);

            await qz.print(printConfig, [{ type: 'pdf', format: 'base64', data: base64data }]);
            // await qz.print(printConfig, [
            //     { type: 'raw', format: 'command', data: '\x1B\x69' } // Lệnh ESC/POS để cắt giấy
            // ]);

            await qz.print(printConfig, [
                { type: 'raw', format: 'command', data: '\x1B\x64\x01' } // Lệnh ESC/POS để cắt giấy
            ]);

        } catch (error) {
            throw new Error(`Print error for order ID ${orderId}: ${error.message}`);
        }
    };
    useEffect(() => {
        return () => {
            disconnectFromQz();
        };
    }, []);

    function formatDiscount(discount) {
        if (!discount) return '0 VND';

        if (typeof discount === 'string' && discount.includes('%')) {
            return discount;
        }

        const numericValue = parseFloat(discount.replace(/[^\d.-]/g, ''));
        return `${numericValue.toLocaleString('vi-VN')} VND`;
    }

    const handleSelectAllChange = () => {
        setAllChecked(!allChecked);
        setSelectedOrders(prevSelected => {
            if (!allChecked) {
                return orders
                    .filter(order => order.statusName === "Đã xử lý")
                    .map(order => order.orderId);
            } else {
                return [];
            }
        });
    };


    const handleCheckboxChange = (orderId) => {
        setSelectedOrders(prevSelected => {
            const order = orders.find(o => o.orderId === orderId);

            if (!order) return prevSelected;


            if (order.statusName !== "Đã xử lý") return prevSelected;

            const newSelected = prevSelected.includes(orderId)
                ? prevSelected.filter(id => id !== orderId)
                : [...prevSelected, orderId];

            setAllChecked(orders.filter(o => o.statusName === "Đã xử lý").every(order => newSelected.includes(order.orderId)));

            return newSelected;
        });
    };

    const [showSelectAll, setShowSelectAll] = useState(false);

    useEffect(() => {
        setShowSelectAll(orders.some(order => order.statusName === "Đã xử lý"));
    }, [orders]);

    return (
        <div>
            <div className='font-14'>
                <div className='bg-body-tertiary py-2'>
                    <div className='container'>
                        <div className='d-flex align-items-center justify-content-between mb-3'>
                            <h4 className='m-0 d-flex align-items-center'>
                                <FaClipboardList />&ensp;Đơn hàng
                            </h4>
                            {selectedOrders.length > 0 && (
                                <CustomButton
                                    className='bg-black bg-gradient text-white'
                                    textColor="white"
                                    handleClick={handlePrintSelected}
                                    btnName="Xuất hóa đơn"
                                    tooltip="Nhấn để xuất hóa đơn"
                                    icon={<FaFileInvoice />}
                                />
                            )}
                        </div>

                        <div className='d-flex flex-wrap flex-md-nowrap align-items-center justify-content-between gap-3'>
                            <InputGroup className='flex-grow-1'>
                                <InputGroup.Text className='custom-radius'><FaSearch /></InputGroup.Text>
                                <Form.Control
                                    className='custom-radius'
                                    placeholder='Tìm kiếm đơn hàng . . .'
                                    value={keyword}
                                    onChange={(e) => handleKeywordChange(e)}
                                />
                            </InputGroup>

                            <div className='d-flex flex-column flex-md-row gap-3 w-100 mt-md-0'>
                                <div className='flex-grow-1'>
                                    <Select
                                        className="w-100"
                                        options={statusOptions}
                                        placeholder="Trạng thái đơn hàng"
                                        onChange={(selectedOption) => handleChange(selectedOption, 'status')}
                                        styles={customReactSelectOrderStatusOptionsStyles}
                                        isClearable
                                    />
                                </div>
                                <div className='flex-grow-1'>
                                    <Select
                                        className="w-100"
                                        options={pageSizeOptions}
                                        placeholder="Số lượng trên trang"
                                        onChange={(selectedOption) => handleChange(selectedOption, 'pageSize')}
                                        isClearable
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>
                                    {showSelectAll ? (
                                        <OverlayTrigger placement="top" overlay={<Tooltip id="select-all-tooltip">Chọn tất cả để xuất hóa đơn</Tooltip>}>
                                            <di className='d-flex justify-content-between'>
                                                <input
                                                    type="checkbox"
                                                    checked={allChecked}
                                                    onChange={handleSelectAllChange}
                                                />
                                                <span>Chọn tất</span>
                                            </di>
                                        </OverlayTrigger>
                                    ) : (
                                        <span> </span>
                                    )}
                                </th>
                                <th>ID</th>
                                <th>Khách hàng</th>
                                <th>Địa chỉ</th>
                                <th>Điện thoại</th>
                                <th>Ngày đặt hàng</th>
                                <th>Trạng thái</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>

                            {orders.length === 0 ? (
                                <p>Không tìm thấy đơn hàng nào.</p>
                            ) : (
                                orders?.map(
                                    (order) => (
                                        <React.Fragment key={order?.orderId}>
                                            <tr className='custom-table'>
                                                <td>
                                                    {order?.statusName === 'Đã xử lý' && (
                                                        <OverlayTrigger placement="top" overlay={<Tooltip id={`order-${order.orderId}-tooltip`}>Chọn đơn hàng để xuất hóa đơn</Tooltip>}>
                                                            <div>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedOrders.includes(order.orderId)}
                                                                    onChange={() => handleCheckboxChange(order.orderId)}
                                                                />
                                                            </div>
                                                        </OverlayTrigger>
                                                    )}
                                                </td>
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
                                                    {order?.phone ? (
                                                        order.phone
                                                    ) : (
                                                        <p className='px-2 py-1 bg-danger-subtle text-center rounded-3 me-1'>Chưa có</p>
                                                    )}
                                                </td>

                                                <td> {moment(order?.orderDate).subtract(7, 'hours').format('DD/MM/YYYY HH:mm')} </td>
                                                <td style={{ width: '200px' }}>
                                                    <Select options={orderStatus} value={orderStatus.find(option => option.label === order?.statusName)}
                                                        styles={customReactSelectOrderStatusOptionsStyles}
                                                        onChange={(option) => handleChangeStatus(option, order?.orderId)} /> </td>
                                                <td>
                                                    <CustomButton
                                                        btnBG={'secondary'}
                                                        btnName={
                                                            <>
                                                                {orderID?.value === order?.orderId && orderID.isOpen && orderDetails && order?.isOpenOrderDetail ? <FaChevronDown /> : <FaChevronRight />}
                                                            </>
                                                        }
                                                        textColor={'white'}
                                                        handleClick={() => toggleOrderDetails(order)}
                                                        tooltip="Xem chi tiết đơn hàng"
                                                    />
                                                </td>
                                            </tr>
                                            {(orderID?.value === order?.orderId && orderID.isOpen && orderDetails && order?.isOpenOrderDetail) &&
                                                (
                                                    <tr>
                                                        <td colSpan={8}>
                                                            <Table responsive variant="light">
                                                                <thead className='bg-light'>
                                                                    <th className='text-center'>STT</th>
                                                                    <th style={{ width: '270px' }} className='text-center'>Sản phẩm</th>
                                                                    <th style={{ width: '150px' }} className='text-center'></th>
                                                                    <th colSpan={2} className='text-center no-print'>Thuộc tính</th>
                                                                    <th className='text-center'>Đơn giá</th>
                                                                    <th className='text-center'>Số lượng</th>
                                                                    <th className='text-center'>Thành tiền</th>
                                                                    <th colSpan={2} className='no-print' ></th>
                                                                </thead>
                                                                <tbody>
                                                                    {orderDetails?.orderDetail?.map((orderDetail) => (
                                                                        orderDetail?.product.map((item) => (
                                                                            <tr key={item.productID} className='custom-table'>
                                                                                <td >{orderDetails?.orderDetail.indexOf(orderDetail) + 1}</td>
                                                                                <td style={{
                                                                                    maxWidth: '150px',
                                                                                    overflow: 'hidden',
                                                                                    textOverflow: 'ellipsis',
                                                                                    whiteSpace: 'nowrap'
                                                                                }} className="print-text-wrap p-1">
                                                                                    {item?.productName} <span> - [{item?.orderVersionAttribute?.color?.label} - {item?.orderVersionAttribute?.size?.label}]</span>
                                                                                </td>

                                                                                <td className='d-flex justify-content-center text-center p-1'>
                                                                                    <img
                                                                                        src={item?.imageUrl || '/images/default-image.png'}
                                                                                        alt={item?.productName}
                                                                                        style={{
                                                                                            maxWidth: '120px',
                                                                                            maxHeight: '80px',
                                                                                            width: 'auto',
                                                                                            height: 'auto',
                                                                                            objectFit: 'contain'
                                                                                        }}
                                                                                    />
                                                                                </td>

                                                                                {isEditVersion.isEdit && isEditVersion.orderDetailsID === orderDetail.orderDetailId ? (
                                                                                    <React.Fragment>
                                                                                        <td className="no-print text-center p-1">
                                                                                            <Select
                                                                                                options={item?.productAttributes?.colors}
                                                                                                value={item?.orderVersionAttribute?.color}
                                                                                                onChange={selectedOption => handleSelectChange(orderDetail, item, 'color', selectedOption)}
                                                                                            />
                                                                                        </td>

                                                                                        <td className='no-print text-center p-1'>
                                                                                            <Select
                                                                                                options={item?.productAttributes?.sizes}
                                                                                                value={item?.orderVersionAttribute?.size}
                                                                                                onChange={selectedOption => handleSelectChange(orderDetail, item, 'size', selectedOption)}
                                                                                            />
                                                                                        </td>
                                                                                    </React.Fragment>
                                                                                ) : (
                                                                                    <React.Fragment>
                                                                                        <td className='no-print text-center p-1'>{item?.orderVersionAttribute?.color?.label}</td>
                                                                                        <td className='no-print text-center p-1'>{item?.orderVersionAttribute?.size?.label}</td>
                                                                                    </React.Fragment>
                                                                                )}

                                                                                <td className='text-center p-1'>{`${(item?.price || 0).toLocaleString('vi-VN')} VND`}</td>

                                                                                <td className='text-center p-1'>
                                                                                    {order?.statusName === 'Pending' ? (
                                                                                        <div className='d-flex justify-content-center'>
                                                                                            <OverlayTrigger placement="top" overlay={<Tooltip id={`decrease-quantity-tooltip-${orderDetail.orderDetailId}-${item.productID}`}>Giảm số lượng</Tooltip>}>
                                                                                                <span>
                                                                                                    <Button
                                                                                                        className='bg-black bg-gradient'
                                                                                                        variant="secondary"
                                                                                                        size="sm"
                                                                                                        onClick={() => handleQuantityChange(orderDetail.orderDetailId, item.productID, item.quantity, -1)}
                                                                                                    >
                                                                                                        -
                                                                                                    </Button>
                                                                                                </span>
                                                                                            </OverlayTrigger>

                                                                                            <OverlayTrigger placement="top" overlay={<Tooltip id={`quantity-input-tooltip-${orderDetail.orderDetailId}-${item.productID}`}>Nhập số lượng</Tooltip>}>
                                                                                                <div>
                                                                                                    <input
                                                                                                        type="text"
                                                                                                        className="mx-2 text-center quantity-custom form-control form-control-sm"
                                                                                                        value={quantities[`${orderDetail.orderDetailId}-${item.productID}`] !== undefined ? quantities[`${orderDetail.orderDetailId}-${item.productID}`] : item.quantity}
                                                                                                        onChange={(e) => handleQuantityInputChange(orderDetail.orderDetailId, item.productID, e.target.value)}
                                                                                                        onBlur={(e) => handleQuantityInputBlur(orderDetail.orderDetailId, item.productID, e.target.value)}
                                                                                                        onKeyDown={(e) => handleKeyPress(e, orderDetail.orderDetailId, item.productID, e.target.value)}
                                                                                                        style={{ width: '50px', textAlign: 'center' }}
                                                                                                    />
                                                                                                </div>
                                                                                            </OverlayTrigger>

                                                                                            <OverlayTrigger placement="top" overlay={<Tooltip id={`increase-quantity-tooltip-${orderDetail.orderDetailId}-${item.productID}`}>Tăng số lượng</Tooltip>}>
                                                                                                <span>
                                                                                                    <Button
                                                                                                        className='bg-black bg-gradient'
                                                                                                        variant="secondary"
                                                                                                        size="sm"
                                                                                                        onClick={() => handleQuantityChange(orderDetail.orderDetailId, item.productID, item.quantity, 1)}
                                                                                                    >
                                                                                                        +
                                                                                                    </Button>
                                                                                                </span>
                                                                                            </OverlayTrigger>
                                                                                        </div>
                                                                                    ) : (
                                                                                        item?.quantity
                                                                                    )}
                                                                                </td>

                                                                                <td className='text-end text-right'>{`${(item?.total || 0).toLocaleString('vi-VN')} VND`}</td>

                                                                                {order?.statusName === 'Pending' &&
                                                                                    (isEditVersion.isEdit && isEditVersion.orderDetailsID === orderDetail.orderDetailId ? (
                                                                                        <React.Fragment style={{ width: '50px !important' }}>
                                                                                            <td className='no-print p-1 text-center'>
                                                                                                <CustomButton
                                                                                                    btnBG={'success'}
                                                                                                    btnType={'button'}
                                                                                                    textColor={'text-white'}
                                                                                                    btnName={<HiCheck />}
                                                                                                    handleClick={() => handleSaveVersionChanges(orderDetail)}
                                                                                                    tooltip="Lưu thay đổi"
                                                                                                />
                                                                                            </td>
                                                                                            <td className='no-print p-1 text-center'>
                                                                                                <CustomButton
                                                                                                    btnBG={'danger'}
                                                                                                    btnType={'button'}
                                                                                                    textColor={'text-white'}
                                                                                                    btnName={<ImCancelCircle />}
                                                                                                    handleClick={() => setEditVersion({ isEdit: false, orderDetailsID: null })}
                                                                                                    tooltip="Hủy bỏ"
                                                                                                />
                                                                                            </td>
                                                                                        </React.Fragment>
                                                                                    ) : (
                                                                                        <React.Fragment style={{ width: '50px !important' }}>
                                                                                            <td className='no-print p-1 text-center'>
                                                                                                <CustomButton
                                                                                                    btnBG={'danger'}
                                                                                                    btnType={'button'}
                                                                                                    textColor={'text-white'}
                                                                                                    btnName={<FaTrash />}
                                                                                                    handleClick={() => handleDeleteOrderDetail(order?.orderId, orderDetail?.orderDetailId)}
                                                                                                    tooltip="Xóa"
                                                                                                />
                                                                                            </td>

                                                                                            <td className='no-print p-1 text-center'>
                                                                                                <CustomButton
                                                                                                    btnBG={'warning'}
                                                                                                    btnType={'button'}
                                                                                                    textColor={'text-white'}
                                                                                                    btnName={<MdModeEdit />}
                                                                                                    handleClick={() => setEditVersion({ isEdit: true, orderDetailsID: orderDetail.orderDetailId })}
                                                                                                    tooltip="Sửa"
                                                                                                />
                                                                                            </td>
                                                                                        </React.Fragment>
                                                                                    ))}
                                                                            </tr>
                                                                        ))
                                                                    ))}

                                                                    <tr className="no-print bg-white">
                                                                        <td rowSpan="7" colSpan="6" className='bg-light'>
                                                                            <div className="p-3 d-flex flex-column align-items-start">
                                                                                <div className="d-flex align-items-center mb-2">
                                                                                    <strong className="text-info me-2">Phương thức thanh toán:</strong>
                                                                                    <span>{order?.paymentMethod}</span>
                                                                                </div>

                                                                                {order?.lastUpdatedById && order?.lastUpdatedByFullname && (
                                                                                    <div className="d-flex align-items-center"> {/* Last Updated Row */}
                                                                                        <strong className="text-info me-2">Cập nhật lần cuối:</strong>
                                                                                        <span>{moment(order?.lastUpdatedDate).format('DD/MM/YYYY HH:mm:ss')}</span>
                                                                                        <span className="mx-2">|</span> {/* Separator */}
                                                                                        <strong className="text-info me-2">Bởi:</strong>
                                                                                        <Link
                                                                                            to={`/admin/users/manage`}
                                                                                            state={{
                                                                                                id: order?.lastUpdatedById,
                                                                                                fullname: order?.lastUpdatedByFullname
                                                                                            }}
                                                                                            style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}
                                                                                        >
                                                                                            {order?.lastUpdatedByFullname}
                                                                                        </Link>

                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </td>
                                                                    </tr>

                                                                    <tr>

                                                                        <td colSpan={1} className='reduce-colspan' style={{ textAlign: 'right', fontWeight: 'bold' }}>Tổng đơn hàng:</td>
                                                                        <td className='text-end'>
                                                                            {`${(order?.subTotal || 0).toLocaleString('vi-VN')} VND`}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colSpan={1} className='reduce-colspan' style={{ textAlign: 'right', fontWeight: 'bold' }}>Phí vận chuyển:</td>
                                                                        <td className='text-end'>
                                                                            {`${(order?.shippingFee || 0).toLocaleString('vi-VN')} VND`}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colSpan={1} className='reduce-colspan' style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                                            Giảm giá: ({formatDiscount(order?.disCount)})
                                                                        </td>
                                                                        <td className='text-end'>
                                                                            {`${(order?.discountValue || 0).toLocaleString('vi-VN')} VND`}
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td colSpan={1} className='reduce-colspan' style={{ textAlign: 'right', fontWeight: 'bold' }}>Tổng cộng:</td>
                                                                        <td className='text-end'>
                                                                            {`${(order?.finalTotal || 0).toLocaleString('vi-VN')} VND`}
                                                                        </td>
                                                                    </tr>
                                                                    {order?.statusName === 'Đã xử lý' && (
                                                                        <tr className='no-print'>
                                                                            <td colSpan={2} style={{ textAlign: 'right' }}>
                                                                                <CustomButton
                                                                                    className='bg-black bg-gradient'
                                                                                    textColor="white"
                                                                                    handleClick={() => printInvoice(order?.orderId)}
                                                                                    btnName="Xuất hóa đơn"
                                                                                    tooltip="Nhấn để xuất hóa đơn"
                                                                                    icon={<FaFileInvoice />}
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                    )}
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
                        <p className='font-13'>
                            Hiển thị <span className="text-primary">{numberOfElements || 0}</span> trong tổng số <span className="text-primary">{totalElements || 0}</span> kết quả
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

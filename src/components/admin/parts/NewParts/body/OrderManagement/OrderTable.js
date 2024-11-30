import React, { useEffect, useState, useRef } from 'react';

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
                    setOrders(response.data.data.content);
                    setTotalPage(response?.data?.data?.totalPages);
                    setTotalElements(response?.data?.data?.totalElements);
                } else if (response?.data?.errorCode === 404) {
                    setOrders([]);
                    setTotalPage(0);
                    setTotalElements(0);
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
    useEffect(() => {
        axiosInstance.get('/staff/orders/statuses')
            .then((response) => {
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

                    const formattedOptions = statuses.map(status => ({
                        value: status.statusId,
                        label: status.statusName
                    }));
                    formattedOptions.unshift({
                        value: null,
                        label: 'All Statuses'
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
    }, []);



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

    const componentRef = React.useRef();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    // const handlePrint = async () => {
    //     try {
    //         const iframe = document.createElement('iframe');
    //         iframe.style.display = 'none'; // Ẩn iframe
    //         document.body.appendChild(iframe);

    //         const printContents = componentRef.current.innerHTML;

    //         if (!printContents) {
    //             console.error("Không có nội dung để in.");
    //             return;
    //         }
    //         const doc = iframe.contentWindow.document;
    //         doc.open();
    //         doc.write(`
    //         <html>
    //             <head>
    //                 <title>Invoice</title>
    //                 <style>

    //                     body {
    //                         font-size: 12px;
    //                         color: #333;
    //                         padding: 0;
    //                     }

    //                     @page {
    //                         size: A5;
    //                         transform: scale(50)!important; 
    //                         transform-origin: top left; 
    //                     }

    //                     h3 {
    //                         text-align: center;
    //                         color: #444;
    //                         margin-bottom: 20px;
    //                     }
    //                     table {
    //                         width: 100%;
    //                         border-collapse: collapse;
    //                         margin-top: 20px;
    //                     }

    //                     .no-print {
    //                         display: none !important;
    //                     }
    //                     .product-name {
    //                         max-width: 150px;
    //                         overflow: hidden;
    //                         text-overflow: ellipsis;
    //                         white-space: nowrap;
    //                     }
    //                     .order-table-img {
    //                         max-width: 120px;
    //                         max-height: 80px;
    //                         width: auto;
    //                         height: auto;
    //                         object-fit: contain;
    //                     }
    //                     .custom-button {
    //                         display: none;
    //                     }
    //                     .order-summary td {
    //                         font-weight: bold;
    //                     }
    //                     .order-summary {
    //                         margin-top: 20px;
    //                     }

    //                    .print-text-wrap {
    //                             white-space: normal !important;
    //                             word-wrap: break-word !important;
    //                             overflow: visible !important;
    //                    }

    //                    table {
    //                     width: 100%;
    //                     border-collapse: collapse;  /* Hợp nhất các đường viền */
    //                 }

    //                 th, td {
    //                     border: 1px solid #000; 
    //                     padding: 8px; 
    //                     text-align: left; 
    //                     word-wrap: break-word;
    //                 }                      


    //                 th:nth-child(2),
    //                 td:nth-child(2) {
    //                     width: auto !important; 
    //                 }

    //                 th:nth-child(3),
    //                 td:nth-child(3) {
    //                     width: 80px !important; 
    //                 }


    //                 th:nth-child(5),
    //                 td:nth-child(5) {
    //                     width: 100px !important; 
    //                 }


    //                 /*Cột quantity*/
    //                 th:nth-child(7),
    //                 td:nth-child(7) {
    //                      width: 10px !important; 
    //                 }

    //                 /*Cột tiền*/
    //                 th:nth-child(8),
    //                 td:nth-child(8) {
    //                      width: 150px !important; 
    //                 }

    //                 .print {
    //                     display: table-row !important;
    //                 }
    //                 .no-print {
    //                     display: none !important;
    //                 }

    //                 .text-center {
    //                     text-align: center;
    //                 }

    //                  .text-right {
    //                     text-align: right;
    //                 }

    //                 th {
    //                     background-color: #f8f8f8;
    //                     font-weight: bold;
    //                 }

    //                 tr {
    //                     page-break-inside: avoid;  /* Tránh chia cắt các dòng khi in */
    //                 }
    //                 .quantity-custom{
    //                     background: none !important;
    //                     box-shadow: none !important; 
    //                     border: none !important; 
    //                     text-align: center !important; 
    //                     padding: 0;
    //                 }

    //                 .print-width {
    //                     width: 600px !important;
    //                 }
    //                 .qr-code {
    //                 position: absolute;
    //                 top: 0px;  
    //                 left: 0px; 
    //                 text-align: left;
    //                 padding: 10px;
    //                 border: 1px solid pink;
    //                 border-radius: 5px;
    //             }

    //                 </style>
    //             </head>
    //             <body>
    //             ${printContents}
    //             </body>
    //         </html>
    //     `);

    //         doc.close();

    //         // Chờ ảnh tải xong 
    //         await new Promise((resolve, reject) => {
    //             const images = iframe.contentWindow.document.images;
    //             if (images.length === 0) {
    //                 resolve();
    //                 return;
    //             }
    //             Promise.all(Array.from(images).map(img => new Promise((res, rej) => {
    //                 const handleLoad = () => res();
    //                 const handleError = () => rej();
    //                 img.onload = handleLoad;
    //                 img.onerror = handleError;
    //                 if (img.complete) handleLoad();
    //             }))).then(resolve).catch(reject);
    //         });

    //         if (typeof window.print !== 'function') {
    //             console.warn('Trình duyệt này có vẻ không hỗ trợ chức năng in.');
    //             toast.error('Trình duyệt của bạn có thể không hỗ trợ chức năng in. Vui lòng thử trình duyệt khác.');
    //             return;
    //         }

    //         // Kiểm tra khả năng in
    //         if (iframe.contentWindow && iframe.contentWindow.print) {
    //             iframe.contentWindow.print();
    //         } else {
    //             console.error("Print function not supported or blocked by the browser.");
    //             toast.error("Trình duyệt không hỗ trợ chức năng in hoặc bị chặn. Vui lòng kiểm tra cài đặt trình duyệt.");
    //         }

    //         document.body.removeChild(iframe);
    //     } catch (error) {
    //         console.error("Error during printing:", error);
    //         let errorMessage = "Đã xảy ra lỗi trong quá trình in. Vui lòng thử lại.";
    //         if (error instanceof DOMException && error.name === "SecurityError") {
    //             errorMessage = "Trình duyệt hoặc cài đặt bảo mật đã chặn thao tác in ấn. Vui lòng kiểm tra cài đặt của bạn.";
    //         } else if (error.message.includes("blocked by a popup blocker")) {
    //             errorMessage = "Cửa sổ in ấn đã bị trình chặn popup chặn. Vui lòng kiểm tra cài đặt của trình chặn popup.";
    //         }
    //         toast.error(errorMessage, {
    //             position: toast.POSITION.TOP_RIGHT,
    //             autoClose: 5000,
    //         });
    //         setModalIsOpen(true);
    //         toast.error(errorMessage);
    //     }
    // };

    const PUBLIC_CERTIFICATE = process.env.REACT_APP_PUBLIC_CERTIFICATE;
    const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;

    const printInvoice = async (orderId) => {
        try {
            const response = await axiosInstance.post(`/staff/orders/export?orderId=${orderId}`, {}, { responseType: 'blob' });

            if (!response || !response.data) {
                throw new Error("No image data received from backend.");
            }

            const blob = new Blob([response.data], { type: 'image/png' });
            const reader = new FileReader();
            reader.readAsDataURL(blob);

            const base64Promise = new Promise((resolve, reject) => {
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
            });

            const base64data = (await base64Promise).split(',')[1].replace(/[^A-Za-z0-9+/=]/g, ''); // Loại bỏ các ký tự không mong muốn

            const options = {
                host: 'localhost', //Sử dụng tên miền chính thức để không phải hiển thị hỏi lại.
                port: {
                    secure: [8181, 8282, 8383, 8484],
                    insecure: [8182, 8283, 8384, 8485]
                },
                // usingSecure: true, // If using HTTPS
                allowUserInteraction: false, 
                usingSecure: false,
                keepAlive: 60,
                retries: 3,
                delay: 5
            };

            console.log("Connecting to QZ Tray with options:", options);

            await qz.websocket.connect(options);

            if (!qz.websocket.isActive()) {
                throw new Error(`Failed to connect to QZ Tray`);
            }

            console.log("Connected to QZ Tray");
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

            const printerName = 'Microsoft Print to PDF';
            const printConfig = qz.configs.create(printerName);

            console.log("Printing with config:", printConfig);

            // In hình ảnh
            await qz.print(printConfig, [{ type: 'image', format: 'base64', data: base64data }]);

            // Lệnh cắt giấy
            await qz.print(printConfig, [
                { type: 'raw', format: 'command', data: '\x1B\x69' } // Lệnh ESC/POS để cắt giấy
            ]);

            toast.success('Print successful and paper cut!');
        } catch (error) {
            toast.error(`Print error: ${error.message}`);
        } finally {
            qz.websocket.disconnect();
        }
    };

    // const handlePrint = () => {
    //     printJS({
    //         printable: componentRef.current, // Tham chiếu đến phần tử React cần in
    //         type: 'html', 
    //         // Đường dẫn đến file CSS cho in ấn (quan trọng!)
    //         // optional properties:
    //         // style: '', // Inline styles
    //         // documentTitle: 'Invoice', // Title của cửa sổ in
    //         // header: '', // Nội dung header (tùy chọn)
    //         // footer: '', // Nội dung footer (tùy chọn)
    //     });
    // };
    // const handlePrint = async () => {
    //     try {
    //         if (componentRef.current) {
    //             console.log('Component content:', componentRef.current.innerHTML);

    //             const elements = document.querySelectorAll('.d-none'); elements.forEach(element => element.classList.remove('d-none')); const canvas = await html2canvas(componentRef.current); const imgData = canvas.toDataURL('image/png'); const width = 900; const height = 650; elements.forEach(element => element.classList.add('d-none'));
    //             // Tính toán vị trí để cửa sổ xuất hiện ở giữa
    //             const left = (window.screen.width - width) / 2;
    //             const top = (window.screen.height - height) / 2;

    //             const printWindow = window.open('', '', `width=${width},height=${height},top=${top},left=${left}`);
    //             printWindow.document.write(`
    //                 <html>
    //                     <head>
    //                         <title>Invoice</title>
    //                         <style>
    //                             body {
    //                                 font-size: 12px;
    //                                 color: #333;
    //                                 margin: 0;
    //                                 padding: 0;
    //                             }
    //                             img {
    //                                 width: 100%;
    //                                 height: auto;
    //                             }
    //                         </style>
    //                     </head>
    //                     <body>
    //                         <img src="${imgData}" />
    //                     </body>
    //                 </html>
    //             `);

    //             printWindow.document.close();
    //             printWindow.focus();
    //             printWindow.print();
    //             printWindow.close();
    //         } else {
    //             console.log('Component ref is undefined');
    //         }
    //     } catch (error) {
    //         console.log('Error generating canvas:', error);
    //     }
    // };

    function formatDiscount(discount) {
        if (!discount) return '0 VND';

        if (typeof discount === 'string' && discount.includes('%')) {
            return discount;
        }

        const numericValue = parseFloat(discount.replace(/[^\d.-]/g, ''));
        return `${numericValue.toLocaleString('vi-VN')} VND`;
    }

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

                        <div className='d-flex justify-content-between align-items-center' style={{ width: "40%" }}>
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
                                                <td> {moment(order?.orderDate).subtract(7, 'hours').format('DD/MM/YYYY HH:mm')} </td>
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
                                                        btnName={
                                                            <>
                                                                Details {orderID?.value === order?.orderId && orderID.isOpen && orderDetails && order?.isOpenOrderDetail ? <FaChevronDown /> : <FaChevronRight />}
                                                            </>
                                                        }
                                                        textColor={'white'}
                                                        handleClick={() => toggleOrderDetails(order)}
                                                    />
                                                </td>
                                            </tr>
                                            {(orderID?.value === order?.orderId && orderID.isOpen && orderDetails && order?.isOpenOrderDetail) &&
                                                (
                                                    <tr>
                                                        <td colSpan={7} ref={componentRef} id="my-content">
                                                            <Table hover striped>
                                                                <thead>
                                                                    <th className='text-center'>#</th>
                                                                    <th style={{ width: '270px' }} className='text-center'>Product</th>
                                                                    <th style={{ width: '150px' }} className='text-center'></th>
                                                                    <th colSpan={2} className='text-center no-print'>Attributes</th>
                                                                    <th className='text-center'>Unit price</th>
                                                                    <th className='text-center'>Quantity</th>
                                                                    <th className='text-center'>Total</th>
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
                                                                                            <Button className='no-print' variant="secondary" size="sm" onClick={() => handleQuantityChange(orderDetail.orderDetailId, item.productID, item.quantity, -1)}>
                                                                                                -
                                                                                            </Button>
                                                                                            <input
                                                                                                type="text"
                                                                                                className="mx-2 text-center quantity-custom"
                                                                                                value={quantities[`${orderDetail.orderDetailId}-${item.productID}`] !== undefined ? quantities[`${orderDetail.orderDetailId}-${item.productID}`] : item.quantity}
                                                                                                onChange={(e) => handleQuantityInputChange(orderDetail.orderDetailId, item.productID, e.target.value)}
                                                                                                onBlur={(e) => handleQuantityInputBlur(orderDetail.orderDetailId, item.productID, e.target.value)}
                                                                                                onKeyDown={(e) => handleKeyPress(e, orderDetail.orderDetailId, item.productID, e.target.value)}
                                                                                                style={{ width: '50px', textAlign: 'center' }}
                                                                                            />
                                                                                            <Button className='no-print' variant="secondary" size="sm" onClick={() => handleQuantityChange(orderDetail.orderDetailId, item.productID, item.quantity, 1)}>
                                                                                                +
                                                                                            </Button>
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
                                                                                                />
                                                                                            </td>
                                                                                            <td className='no-print p-1 text-center'>
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
                                                                                        <React.Fragment style={{ width: '50px !important' }}>
                                                                                            <td className='no-print p-1 text-center'>
                                                                                                <CustomButton
                                                                                                    btnBG={'danger'}
                                                                                                    btnType={'button'}
                                                                                                    textColor={'text-white'}
                                                                                                    btnName={<FaTrash />}
                                                                                                    handleClick={() => handleDeleteOrderDetail(order?.orderId, orderDetail?.orderDetailId)}
                                                                                                />
                                                                                            </td>

                                                                                            <td className='no-print p-1 text-center'>
                                                                                                <CustomButton
                                                                                                    btnBG={'warning'}
                                                                                                    btnType={'button'}
                                                                                                    textColor={'text-white'}
                                                                                                    btnName={<MdModeEdit />}
                                                                                                    handleClick={() => setEditVersion({ isEdit: true, orderDetailsID: orderDetail.orderDetailId })}
                                                                                                />
                                                                                            </td>
                                                                                        </React.Fragment>
                                                                                    ))}
                                                                            </tr>
                                                                        ))
                                                                    ))}

                                                                    <tr className='no-print'>
                                                                        <td rowSpan="7" colSpan="6" className="text-center font-weight-bold">
                                                                            <span>Last Updated: {moment(order?.lastUpdatedDate).format('DD/MM/YYYY HH:mm:ss')} </span>

                                                                            {order?.lastUpdatedBy && (
                                                                                <>
                                                                                    By:
                                                                                    <Link to={`/user-management/${order?.lastUpdatedBy?.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                                                        {order?.lastUpdatedBy}
                                                                                    </Link>
                                                                                </>
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                    <tr className='no-print'>

                                                                        <td colSpan={1} className='reduce-colspan' style={{ textAlign: 'right', fontWeight: 'bold' }}>Tổng đơn hàng:</td>
                                                                        <td className='text-end'>
                                                                            {`${(order?.subTotal || 0).toLocaleString('vi-VN')} VND`}
                                                                        </td>
                                                                    </tr>
                                                                    <tr className='no-print'>
                                                                        <td colSpan={1} className='reduce-colspan' style={{ textAlign: 'right', fontWeight: 'bold' }}>Phí vận chuyển:</td>
                                                                        <td className='text-end'>
                                                                            {`${(order?.shippingFee || 0).toLocaleString('vi-VN')} VND`}
                                                                        </td>
                                                                    </tr>
                                                                    <tr className='no-print'>
                                                                        <td colSpan={1} className='reduce-colspan' style={{ textAlign: 'right', fontWeight: 'bold' }}>
                                                                            Giảm giá: ({formatDiscount(order?.disCount)})
                                                                        </td>
                                                                        <td className='text-end'>
                                                                            {`${(order?.discountValue || 0).toLocaleString('vi-VN')} VND`}
                                                                        </td>
                                                                    </tr>

                                                                    <tr className='no-print'>
                                                                        <td colSpan={1} className='reduce-colspan' style={{ textAlign: 'right', fontWeight: 'bold' }}>Tổng cộng:</td>
                                                                        <td className='text-end'>
                                                                            {`${(order?.finalTotal || 0).toLocaleString('vi-VN')} VND`}
                                                                        </td>
                                                                    </tr>
                                                                    <tr className='no-print'>
                                                                        <td colSpan={2} style={{ textAlign: 'right' }}>
                                                                            <button className="btn bg-black bg-gradient" style={{ color: 'white' }} onClick={() => printInvoice(order?.orderId)}
                                                                                title="Nhấn để xuất hóa đơn">
                                                                                Xuất hóa đơn
                                                                            </button>
                                                                        </td>
                                                                    </tr>

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
                            {/* <span><a href='#' className='text-decoration-none fw-medium'>{`View all >`}</a></span> */}
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

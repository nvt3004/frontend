import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../../../../services/axiosConfig';
import axios from 'axios';
import moment from 'moment';
import { toast } from 'react-toastify';
import { Button, Form, InputGroup, Pagination, Table } from 'react-bootstrap';
import './style/order.scss';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
const OrderDetail = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        axiosInstance.get(`/orders/${orderId}`)
            .then(response => {
                setOrder(response.data.data.orderDetail[0]);
            })
            .catch(error => {
                toast.error(error.response?.message || 'An error occurred');
            });
    }, [orderId]);

    if (!order) {
        return <div>Loading...</div>;
    }

    function formatDiscount(discount) {
        if (!discount) return '0 VND';

        if (typeof discount === 'string' && discount.includes('%')) {
            return discount;
        }

        const numericValue = parseFloat(discount.replace(/[^\d.-]/g, ''));
        return `${numericValue.toLocaleString('vi-VN')} VND`;
    }

    return (
        <div className="container-fluid invoice-container" style={{ fontFamily: 'Times New Roman, serif !important' }}>
            <div className="container mt-4 pt-4 border rounded">
                <div className="border-bottom pb-4 mb-4">
                    <div className="row justify-content-end mt-4">
                        <div className="col-auto">
                            <Link to="/home" className="btn btn-success btn-lg">
                                <FaHome className="me-2" />
                                Đi đến trang chủ
                            </Link>
                        </div>
                    </div>
                    <div className="text-center mb-4">
                        <h3 className="fw-bold">HÓA ĐƠN BÁN HÀNG</h3>
                        <img src="/images/logo.png" alt="Company Logo" className="img-fluid mb-4" style={{ maxWidth: '100px' }} />
                        <p className="fw-bold">Công ty TNHH Step To The Future</p>
                        <p>Địa chỉ: Đ. Số 22, Thường Thạnh, Cái Răng, Cần Thơ, Việt Nam</p>
                        <p>Số điện thoại: 098 388 11 00</p>
                        <p>Email: caodangfptcantho@gmail.com</p>
                    </div>

                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="border p-3 rounded">
                                <p className="fw-bold">Thông tin khách hàng</p>
                                <p>Tên khách hàng: {order?.fullname || 'N/A'}</p>
                                <p>Địa chỉ: {order?.address || 'N/A'}</p>
                                <p>Số điện thoại: {order?.phone || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="border p-3 rounded">
                                <p className="fw-bold">Thông tin đơn hàng</p>
                                <p>Ngày đặt hàng: {moment(order?.orderDate).subtract(7, 'hours').format('DD/MM/YYYY HH:mm') || 'N/A'}</p>
                                <p>Ngày giao hàng dự kiến: {moment(order?.deliveryDate).subtract(7, 'hours').format('DD/MM/YYYY HH:mm') || 'N/A'}</p>
                                <p>Phương thức thanh toán: {order?.paymentMethod || 'N/A'}</p>
                                <p>Tổng tiền: {`${(order?.finalTotal || 0).toLocaleString('vi-VN')} VND`}</p>
                                <p>Trạng thái: {order?.statusName || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover table-striped border" style={{ width: "100%", tableLayout: "fixed" }}>
                    
                            <thead>
                                <tr>
                                    <th className="text-center" scope="col" style={{ width: "5%" }}>#</th>
                                    <th className="text-center" scope="col" style={{ width: "20%" }}>Sản phẩm</th>
                                    <th className="text-center" scope="col" style={{ width: "15%" }}>Hình ảnh</th>
                                    <th className="text-center" scope="col" style={{ width: "10%" }}>Màu</th>
                                    <th className="text-center" scope="col" style={{ width: "10%" }}>Kích cỡ</th>
                                    <th className="text-center" scope="col" style={{ width: "10%" }}>Đơn giá</th>
                                    <th className="text-center" scope="col" style={{ width: "10%" }}>Số lượng</th>
                                    <th className="text-center" scope="col" style={{ width: "20%" }}>Tổng</th>
                                </tr>
                            </thead>
            

                        <tbody>
                            {order?.productDetails?.map((product, index) => (
                                <tr key={product.orderDetailId}>
                                    <th scope="row" className="text-center">{index + 1}</th>
                                    <td>{product.productName} <span> - [{product?.attributeProductVersion?.color?.color} - {product?.attributeProductVersion?.size?.size}]</span></td>
                                    <td className="text-center">
                                        <img
                                            src={product.imageUrl || '/images/default-image.png'}
                                            alt={product.productName}
                                            className="img-fluid"
                                            style={{ maxWidth: '100px', maxHeight: '80px', objectFit: 'cover', border: '1px solid #ddd' }}
                                        />
                                    </td>
                                    <td className="text-center">{product?.attributeProductVersion?.color?.color || 'N/A'}</td>
                                    <td className="text-center">{product?.attributeProductVersion?.size?.size || 'N/A'}</td>
                                    <td className="text-center">{`${(product.price || 0).toLocaleString('vi-VN')} VND`}</td>
                                    <td className="text-center">{product.quantity}</td>
                                    <td className="text-end">{`${(product.total || 0).toLocaleString('vi-VN')} VND`}</td>
                                </tr>
                            ))}
                            {/* Summary Rows */}
                            <tr>
                                <td rowSpan={4} colSpan={5} className='text-center border-end' style={{ fontWeight: 'bold' }}>
                                    <div className="row">
                                        <div className="col-12 text-center" style={{ color: '#71bdd8' }}>
                                            <h4 className="display-6 font-weight-bold text-primary">
                                                Cảm ơn {order?.gender === 0 ? 'Anh' : order?.gender === 1 ? 'Chị' : 'Quý khách'} {order?.fullname}!
                                            </h4>
                                            <p className="lead">
                                                Chúng tôi rất cảm kích vì {order?.gender === 0 ? 'Anh' : order?.gender === 1 ? 'Chị' : 'Quý khách'} đã đặt hàng.
                                                Chúng tôi hy vọng được tiếp tục phục vụ {order?.gender === 0 ? 'Anh' : order?.gender === 1 ? 'Chị' : 'Quý khách'} trong những lần mua sắm tiếp theo.
                                            </p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>

                                <td colSpan={2} className="text-end fw-bold">Tổng đơn hàng:</td>
                                <td className="text-end">{`${(order?.subTotal || 0).toLocaleString('vi-VN')} VND`}</td>
                            </tr>
                            <tr>
                                <td colSpan={2} className="text-end fw-bold">Giảm giá ({formatDiscount(order?.disCount)}):</td>
                                <td className="text-end">{`${(order?.discountValue || 0).toLocaleString('vi-VN')} VND`}</td>
                            </tr>
                            <tr>
                                <td colSpan={2} className="text-end fw-bold">Tổng cộng:</td>
                                <td className="text-end">{`${(order?.finalTotal || 0).toLocaleString('vi-VN')} VND`}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};



export default OrderDetail;

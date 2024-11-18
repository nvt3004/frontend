import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const InvoicePrint = ({ order, orderDetails }) => {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <div>
            <button onClick={handlePrint}>Print</button>
            <div ref={componentRef}> {/* Apply componentRef here */}
                <h1>Hóa Đơn</h1>
                <p>Order ID: {order?.orderId}</p>
                <p>Ngày đặt: {new Date(order?.orderDate).toLocaleDateString()}</p>
                <h2>Chi tiết đơn hàng:</h2>
                <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Sản phẩm</th>
                            <th>Màu</th>
                            <th>Kích thước</th>
                            <th>Giá</th>
                            <th>Số lượng</th>
                            <th>Tổng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderDetails?.orderDetail?.map((orderDetail, index) => (
                            orderDetail.product && orderDetail.product.length > 0 ? (
                                orderDetail.product.map((item, idx) => (
                                    <tr key={`${orderDetail.orderDetailId}-${idx}`}>
                                        <td>{index + 1}</td>
                                        <td>{item.productName}</td>
                                        <td>{item.orderVersionAttribute?.color?.label ?? "N/A"}</td>
                                        <td>{item.orderVersionAttribute?.size?.label ?? "N/A"}</td>
                                        <td>{(item.price || 0).toLocaleString('vi-VN')} VND</td>
                                        <td>{item.quantity}</td>
                                        <td>{(item.total || 0).toLocaleString('vi-VN')} VND</td>
                                    </tr>
                                ))
                            ) : (
                                <tr key={index}><td colSpan="7">No products in this order detail</td></tr>
                            )
                        ))}
                    </tbody>
                </table>
                <h3>Tổng đơn hàng: {(orderDetails?.orderDetail?.reduce((total, orderDetail) =>
                    total + (orderDetail.product?.reduce((subTotal, item) => subTotal + (Number(item.total) || 0), 0) || 0), 0) || 0).toLocaleString('vi-VN')} VND</h3>
                <h3>Phí vận chuyển: {(order?.shippingFee || 0).toLocaleString('vi-VN')} VND</h3>
                <h3>Giảm giá: {(order?.disCount || 0).toLocaleString('vi-VN')} VND</h3>
                <h3>Tổng cộng: {((orderDetails?.orderDetail?.reduce((total, orderDetail) =>
                    total + (orderDetail.product?.reduce((subTotal, item) => subTotal + (Number(item.total) || 0), 0) || 0), 0) || 0) +
                    (order?.shippingFee || 0) -
                    (order?.disCount || 0)).toLocaleString('vi-VN')} VND</h3>
            </div>
        </div>
    );
};

export default InvoicePrint;
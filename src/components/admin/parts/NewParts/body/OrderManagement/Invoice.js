// Invoice.js
import React from 'react';

const Invoice = React.forwardRef(({ order }, ref) => {
    return (
        <div ref={ref} style={{ padding: '0 20px 20px 20px', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
            {/* Thông tin công ty */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h3>HÓA ĐƠN BÁN HÀNG</h3>
                <p><strong>Công ty TNHH Step To The Future</strong></p>
                <p>Địa chỉ: Đ. Số 22, Thường Thạnh, Cái Răng, Cần Thơ, Việt Nam</p>
                <p>Số điện thoại: 098 388 11 00</p>
                <p>Email: caodangfptcantho@gmail.com</p>
            </div>

            {/* Thông tin khách hàng */}
            <div style={{ marginBottom: '20px' }}>
                <p><strong>Thông tin khách hàng</strong></p>
                <p>Tên khách hàng: {order?.fullname || 'N/A'}</p>
                <p>Địa chỉ: {order?.address || 'N/A'}</p>
                <p>Số điện thoại: {order?.phone || 'N/A'}</p>
                <p>Ngày đặt hàng: {new Date(order?.orderDate).toLocaleDateString() || 'N/A'}</p>
                <p>Ngày giao hàng: {new Date(order?.deliveryDate).toLocaleDateString() || 'N/A'}</p>
            </div>
        </div>
    );
});

export default Invoice;
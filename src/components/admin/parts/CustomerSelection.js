import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { FaUser } from 'react-icons/fa';

const CustomerSelection = () => {
  // State để lưu giá trị khách hàng được chọn
  const [selectedCustomer, setSelectedCustomer] = useState('');

  // Danh sách khách hàng mẫu
  const customers = [
    { id: 1, name: 'Nguyen Van A', info: 'Thông tin về Nguyen Van A', phone: '0909122122', address: 'Cần Thơ, Ninh Kiều, Hưng Lợi, đường 30/4, tòa nhà KhongCoThat' },
    { id: 2, name: 'Tran Thi B', info: 'Thông tin về Tran Thi B', phone: '0909122133', address: 'Cần Thơ, Ninh Kiều, Hưng Lợi, đường 30/4, tòa nhà KhongCoThat' },
    { id: 3, name: 'Le Van C', info: 'Thông tin về Le Van C', phone: '0909122144', address: 'Cần Thơ, Ninh Kiều, Hưng Lợi, đường 30/4, tòa nhà KhongCoThat' }
  ];

  // Hàm để xử lý khi chọn khách hàng
  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    const customer = customers.find(c => c.id === parseInt(selectedId));
    setSelectedCustomer(customer); // Lưu thông tin khách hàng vào state
  };

  return (
    <div>
      {selectedCustomer ? (
        // Hiển thị div chứa thông tin khách hàng nếu đã chọn
        <div>
          {/* <h3>Thông tin khách hàng</h3>
          <p>Tên: {selectedCustomer.name}</p>
          <p>{selectedCustomer.info}</p>
          <button onClick={() => setSelectedCustomer('')}>Chọn lại khách hàng</button> */}
          <Card>
            <Card.Header className='pb-0'>
              <p className='fs-5 fw-medium'>Supplier's Infomation</p>
              <p className='fs-6 fw-bold text-primary d-flex align-items-center m-1'><FaUser />&ensp;{selectedCustomer.name}</p>
            </Card.Header>
            <Card.Body>
              <div className='d-flex mb-0'>
                <div className='col'>
                  <p className='mb-0 font-13'>{selectedCustomer.phone}</p>
                  <p className='font-13'>{selectedCustomer.address}</p>
                </div>
                <div className='col'>

                </div>
              </div>
              <button className='font-13 btn'>Change adress</button>
            </Card.Body>
          </Card>
        </div>

      ) : (
        // Hiển thị select nếu chưa chọn khách hàng
        <select onChange={handleSelectChange} defaultValue="">
          <option value="" disabled>Chọn khách hàng</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default CustomerSelection;

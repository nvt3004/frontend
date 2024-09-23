import React, { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { Modal, Button, Table, Pagination } from 'react-bootstrap';
import orders from '../data/orderData'; // Import data mẫu
import { FaEdit } from 'react-icons/fa';
import { ButtonHover } from './StyledButton';
import Swal from 'sweetalert2';
import BootstrapToast from './Toast';

const OrderManagement = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [manualFilter, setManualFilter] = useState('');

  const itemsPerPage = 6;
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Hàm lọc đơn hàng theo tìm kiếm và bộ lọc
  const filteredOrders = orders
    .filter(order =>
      (order.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.phone.toLowerCase().includes(searchQuery.toLowerCase()))
      && (statusFilter === '' || order.status === statusFilter)
      && (manualFilter === '' || order.manual.toString() === manualFilter)
    )
    .slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleStatusFilterChange = (e) => setStatusFilter(e.target.value);

  const handleManualFilterChange = (e) => setManualFilter(e.target.value);

  const handleColorChange = (index, color) => {
    const updatedProducts = [...selectedOrder.products];
    updatedProducts[index].color = color;
    setSelectedOrder({ ...selectedOrder, products: updatedProducts });
  };

  const handleSizeChange = (index, size) => {
    const updatedProducts = [...selectedOrder.products];
    updatedProducts[index].size = size;
    setSelectedOrder({ ...selectedOrder, products: updatedProducts });
  };

  const handleQuantityChange = (index, quantity) => {
    const updatedProducts = [...selectedOrder.products];
    updatedProducts[index].quantity = quantity;
    updatedProducts[index].totalPrice = quantity * updatedProducts[index].unitPrice;
    const newTotal = updatedProducts.reduce((acc, product) => acc + (product.totalPrice || 0), 0);
    setSelectedOrder({ ...selectedOrder, products: updatedProducts, total: newTotal });
  };

  const [showToast, setShowToast] = useState(false);
  const [toastContent, setToastContent] = useState({ title: '', text: '', color: '' });

  const handleUpdate = () => {
    Swal.fire({
      title: 'Are you sure ?',
      text: 'You might not recover this infomations after update !',
      icon: 'warning',
      showConfirmButton: true,
      confirmButtonText: `Yes, I'm sure !`,
      showCancelButton: true
    }).then((response) => {
      if (response.isConfirmed) {
        setToastContent({
          title: 'Update successed!',
          text: 'The infomatiosn has been changed.',
          color: 'success'
        });
        setShowToast(true);
        handleClose();
      }
    });
  };

  return (
    <div className="order-management">
      <h1>Orders Management</h1>
      {/* Filter Section */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Full Name, Address, Phone"
          className="form-control mb-2 rounded-5 px-3 py-2 border-danger-subtle"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="d-flex">
          <select className="form-select me-2 rounded-5 px-3 py-2 border-danger-subtle" value={statusFilter} onChange={handleStatusFilterChange}>
            <option value="">Filter by Status</option>
            <option value="PENDING">PENDING</option>
            <option value="CONFIRMING">CONFIRMING</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="IN PROCESS">IN PROCESS</option>
            <option value="ON DELIVERY">ON DELIVERY</option>
            <option value="DELIVERED">DELIVERED</option>
          </select>
          <select className="form-select rounded-5 px-3 py-2 border-danger-subtle" value={manualFilter} onChange={handleManualFilterChange}>
            <option value="">Filter by Manual</option>
            <option value="true">Manual</option>
            <option value="false">Automatic</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Full Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>On Date</th>
            <th>Status</th>
            <th>Manual</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.fullname}</td>
              <td>{order.address}</td>
              <td>{order.phone}</td>
              <td>{order.date}</td>
              <td>
                <select className="form-select">
                  <option selected={order.status === 'PENDING'} value="PENDING">PENDING</option>
                  <option selected={order.status === 'CONFIRMING'} value="CONFIRMING">CONFIRMING</option>
                  <option selected={order.status === 'CONFIRMED'} value="CONFIRMED">CONFIRMED</option>
                  <option selected={order.status === 'IN PROCESS'} value="IN PROCESS">IN PROCESS</option>
                  <option selected={order.status === 'ON DELIVERY'} value="ON DELIVERY">ON DELIVERY</option>
                  <option selected={order.status === 'DELIVERED'} value="DELIVERED">DELIVERED</option>
                </select>
              </td>
              <td className={`text-center ${order.manual ? 'text-success' : ''}`}>{order.manual ? <FaCheck /> : null}</td>
              <td>
                <Button variant="warning" className='text-white' onClick={() => handleEdit(order)}><FaEdit /></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination>
        <Pagination.First onClick={() => handlePageChange(1)} />
        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        {[...Array(totalPages)].map((_, idx) => (
          <Pagination.Item key={idx + 1} active={currentPage === idx + 1} onClick={() => handlePageChange(idx + 1)}>
            {idx + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => handlePageChange(totalPages)} />
      </Pagination>

      {/* Modal for Editing Order */}
      {selectedOrder && (
        <Modal show={showModal} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit Order #{selectedOrder.id}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Order Details */}
            <p><strong>Full Name:</strong> {selectedOrder.fullname}</p>
            <p><strong>Address:</strong> {selectedOrder.address}</p>
            <p><strong>Phone:</strong> {selectedOrder.phone}</p>
            <p><strong>Date:</strong> {selectedOrder.date}</p>

            {/* Product List */}
            <Table striped bordered>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product Name</th>
                  <th>Color</th>
                  <th>Size</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Price</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.products.map((product, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{product.name}</td>
                    <td>
                      <select value={product.color} onChange={(e) => handleColorChange(index, e.target.value)}>
                        {/* Tùy chọn màu sắc */}
                        <option value="Red">Red</option>
                        <option value="Blue">Blue</option>
                        <option value="Green">Green</option>
                        {/* Thêm các tùy chọn khác nếu cần */}
                      </select>
                    </td>
                    <td>
                      <select value={product.size} onChange={(e) => handleSizeChange(index, e.target.value)}>
                        {/* Tùy chọn kích thước */}
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        {/* Thêm các tùy chọn khác nếu cần */}
                      </select>
                    </td>
                    <td className='w-25'>
                      <div className='btn-group'>
                        <button className='btn btn-warning text-center text-white fw-bold' onClick={() => handleQuantityChange(index, Math.max(product.quantity - 1, 1))}>-</button>
                        <input
                          className='form-control w-50 text-center'
                          type="number"
                          value={product.quantity}
                          onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                          min="1"
                        />
                        <button className='btn btn-success text-center text-white fw-bold' onClick={() => handleQuantityChange(index, product.quantity + 1)}>+</button>
                      </div>
                    </td>
                    <td>${(product.unitPrice || 0).toFixed(2)}</td>
                    <td>${(product.unitPrice *  product.quantity|| 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Order Summary */}
            <div className="mt-4">
              <p><strong>Shipping:</strong> ${(selectedOrder.shipping || 0).toFixed(2)}</p>
              <p><strong>Discount:</strong> ${(selectedOrder.discount || 0).toFixed(2)}</p>
              <p><strong>Total:</strong> ${(selectedOrder.total || 0).toFixed(2)}</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <ButtonHover className='btn btn-secondary opacity-75 text-white rounded-5 px-3 py-2' onClick={handleClose}>Close</ButtonHover>
            <ButtonHover className='btn btn-success opacity-75 text-white rounded-5 px-3 py-2' onClick={handleUpdate}>Save Changes</ButtonHover>
          </Modal.Footer>
        </Modal>
      )}
      <div>
        <BootstrapToast show={showToast} close={() => setShowToast(false)} title={toastContent.title} text={toastContent.text} color={toastContent.color} />
      </div>
    </div>
  );
}

export default OrderManagement;

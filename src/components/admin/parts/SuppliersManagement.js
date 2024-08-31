import React, { useState } from 'react';
import { Modal, Button, Table, Pagination, Form } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';

const SuppliersManagement = () => {
  const sampleData = [
    { id: 1, supplierName: "ABC Co.", contactName: "John Doe", address: "123 Street", phone: "123-456-7890", email: 'antruqhy.abc@mail.com', status: "active" },
    { id: 2, supplierName: "XYZ Ltd.", contactName: "Jane Smith", address: "456 Avenue", phone: "987-654-3210", email: 'jane.smith@mail.com', status: "inactive" },
    { id: 3, supplierName: "RST Ltd.", contactName: "Jane Smith", address: "789 Boulevard", phone: "234-567-8901", email: 'rst.ltd@mail.com', status: "inactive" },
    { id: 4, supplierName: "NMQ Ltd.", contactName: "John Doe", address: "101 Street", phone: "567-890-1234", email: 'nmq.ltd@mail.com', status: "active" },
    { id: 5, supplierName: "Hahaha Ltd.", contactName: "Jane Smith", address: "202 Avenue", phone: "890-123-4567", email: 'haha.ltd@mail.com', status: "inactive" },
    { id: 6, supplierName: "Hihi Ltd.", contactName: "John Doe", address: "303 Boulevard", phone: "123-456-7890", email: 'hihi.ltd@mail.com', status: "active" },
    { id: 7, supplierName: "Hello Ltd.", contactName: "Jane Smith", address: "404 Street", phone: "456-789-0123", email: 'hello.ltd@mail.com', status: "inactive" },
    { id: 8, supplierName: "Nice Ltd.", contactName: "John Doe", address: "505 Avenue", phone: "789-012-3456", email: 'nice.ltd@mail.com', status: "active" },
    // Thêm nhiều dữ liệu mẫu khác
  ];

  const [suppliers, setSuppliers] = useState(sampleData);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(suppliers.length / itemsPerPage);

  const handleEdit = (supplier) => {
    setCurrentSupplier(supplier);
    setShowModal(true);
  };

  const handleSave = () => {
    // Code lưu thông tin nhà cung cấp
    setShowModal(false);
  };

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filteredSuppliers = sampleData.filter((supplier) =>
      supplier.supplierName.toLowerCase().includes(value) ||
      supplier.contactName.toLowerCase().includes(value) ||
      supplier.address.toLowerCase().includes(value) ||
      supplier.phone.includes(value)
    );
    setSuppliers(filteredSuppliers);
  };

  const [filterStatus, setFilterStatus] = useState('');

  const handleFilter = (e) => {
    const value = e.target.value;
    setFilterStatus(value);
    if (value === '') {
      setSuppliers(sampleData);
    } else {
      const filteredSuppliers = sampleData.filter(supplier => supplier.status === value);
      setSuppliers(filteredSuppliers);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Dữ liệu hiển thị trên trang hiện tại
  const currentSuppliers = suppliers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="container-fluid">
      <h1 className="mt-3">Suppliers Management</h1>
      <div className="mb-3 d-flex">
        <input
          type="text"
          placeholder="Search by Company name, Address, Phone, Email,..."
          className="form-control rounded-5 px-3 py-2 border-danger-subtle me-2"
          value={searchTerm}
          onChange={handleSearch}
        />

        <select
          className="form-select rounded-5 px-3 py-2 border-danger-subtle"
          value={filterStatus}
          onChange={handleFilter}
        >
          <option value="">Filter by Active</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Supplier ID</th>
            <th>Company Name</th>
            <th>Contact Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Status</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {currentSuppliers.map((supplier) => (
            <tr key={supplier.id}>
              <td>{supplier.id}</td>
              <td>{supplier.supplierName}</td>
              <td>{supplier.contactName}</td>
              <td>{supplier.address}</td>
              <td>{supplier.phone}</td>
              <td>{supplier.email}</td>
              <td>{supplier.status}</td>
              <td>
                <Button variant="warning" className='text-white' onClick={() => handleEdit(supplier)}><FaEdit/></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
        {Array.from({ length: totalPages }, (_, i) => (
          <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => handlePageChange(i + 1)}>
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Supplier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Company Name</Form.Label>
              <Form.Control type="text" value={currentSupplier?.supplierName || ''} onChange={(e) => setCurrentSupplier({ ...currentSupplier, supplierName: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Contact Name</Form.Label>
              <Form.Control type="text" value={currentSupplier?.contactName || ''} onChange={(e) => setCurrentSupplier({ ...currentSupplier, contactName: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" value={currentSupplier?.address || ''} onChange={(e) => setCurrentSupplier({ ...currentSupplier, address: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" value={currentSupplier?.phone || ''} onChange={(e) => setCurrentSupplier({ ...currentSupplier, phone: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={currentSupplier?.email || ''} onChange={(e) => setCurrentSupplier({ ...currentSupplier, email: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select value={currentSupplier?.status || ''} onChange={(e) => setCurrentSupplier({ ...currentSupplier, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SuppliersManagement;

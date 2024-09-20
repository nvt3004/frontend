import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import users from '../data/userData';
import UserModal from './UserModal';

const ManageUsers = () => {
  const usersPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGender = genderFilter === 'all' || user.gender.toLowerCase() === genderFilter.toLowerCase();
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesGender && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleShowModal = (user) => {
    console.log('show modal');

    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleGenderChange = (e) => {
    setGenderFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbers = 4;

    let startPage = Math.max(currentPage - 1, 1);
    let endPage = Math.min(currentPage + 2, totalPages);

    if (currentPage === 1) {
      startPage = 1;
      endPage = maxPageNumbers;
    } else if (currentPage === totalPages) {
      startPage = totalPages - maxPageNumbers + 1;
      endPage = totalPages;
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
          <a onClick={() => handleClick(i)} className="page-link">
            {i}
          </a>
        </li>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="container mt-2">
      <h2>Manage Users</h2>

      {/* Search and Filter */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control mb-2 rounded-5 px-3 py-2 border-danger-subtle"
          placeholder="Search users"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <div className="d-flex mb-3">
          <select className="form-select me-2 rounded-5 px-3 py-2 border-danger-subtle" value={genderFilter} onChange={handleGenderChange}>
            <option value="all">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <select className="form-select rounded-5 px-3 py-2 border-danger-subtle" value={roleFilter} onChange={handleRoleChange}>
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="customer">Customer</option>
            <option value="staff">Staff</option>
          </select>
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Fullname</th>
            <th>Birthday</th>
            <th>Gender</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.fullname}</td>
              <td>{user.birthday}</td>
              <td>{user.gender}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleShowModal(user)}>
                  <FaEdit />
                </button>
                <button className="btn btn-danger btn-sm">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <nav>
        <ul className="pagination">
          {currentPage > 1 && (
            <>
              <li className="page-item">
                <a onClick={() => handleClick(1)} className="page-link">{`<<`}</a>
              </li>
              <li className="page-item">
                <a onClick={() => handleClick(currentPage - 1)} className="page-link">{`<`}</a>
              </li>
            </>
          )}
          {renderPageNumbers()}
          {currentPage < totalPages && (
            <>
              <li className="page-item">
                <a onClick={() => handleClick(currentPage + 1)} className="page-link">{`>`}</a>
              </li>
              <li className="page-item">
                <a onClick={() => handleClick(totalPages)} className="page-link">{`>>`}</a>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* User Modal */}
      <UserModal
        show={showModal}
        handleClose={handleCloseModal}
        userData={selectedUser}
      />
    </div>
  );
}

export default ManageUsers;

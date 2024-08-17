import React from 'react';
// import { Link } from 'react-router-dom';
// import styled from 'styled-components';
import StyledLink from './StyledLink';

function AdminNav() {
  return (
    <nav className="bg-white border-right" id="sidebar-wrapper">
      <div className="list-group list-group-flush">
        <button
          className="list-group-item list-group-item-action bg-white"
          data-bs-toggle="collapse"
          data-bs-target="#userManagementCollapse"
          aria-expanded="false"
          aria-controls="userManagementCollapse"
        >
          Users Management
        </button>
        <div className="collapse" id="userManagementCollapse">
          <StyledLink to="/admin/users/add" className="list-group-item text-center bg-secondary-subtle">
            Add New User
          </StyledLink>
          <StyledLink to="/admin/users/manage" className="list-group-item text-center bg-secondary-subtle">
            Manage Users
          </StyledLink>
        </div>

        <button
          className="list-group-item list-group-item-action"
          data-bs-toggle="collapse"
          data-bs-target="#productManagementCollapse"
          aria-expanded="false"
          aria-controls="productManagementCollapse"
        >
          Products Management
        </button>
        <div className="collapse" id="productManagementCollapse">
          <StyledLink to="/admin/products/add" className="list-group-item text-center bg-secondary-subtle">
            Add New Product
          </StyledLink>
          <StyledLink to="/admin/products/manage" className="list-group-item text-center bg-secondary-subtle">
            Manage Products
          </StyledLink>
        </div>

        <button
          className="list-group-item list-group-item-action bg-white"
          data-bs-toggle="collapse"
          data-bs-target="#orderManagementCollapse"
          aria-expanded="false"
          aria-controls="orderManagementCollapse"
        >
          Orders Management
        </button>
        <div className="collapse" id="orderManagementCollapse">
          <StyledLink to="/admin/orders/manage" className="list-group-item text-center bg-secondary-subtle">
            Manage Orders
          </StyledLink>
        </div>
      </div>
    </nav>
  );
}

export default AdminNav;

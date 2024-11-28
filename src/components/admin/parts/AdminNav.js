import React from 'react';
// import { Link } from 'react-router-dom';
// import styled from 'styled-components';
import StyledLink from './StyledLink';

const AdminNav = () => {
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
          {/* <StyledLink to="/admin/users/add" className="list-group-item text-center bg-secondary-subtle">
            Manage Customers
          </StyledLink> */}
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
          <StyledLink to="/admin/products/categories" className="list-group-item text-center bg-secondary-subtle">
            Product's Categories
          </StyledLink>
          <StyledLink to="/admin/products/new" className="list-group-item text-center bg-secondary-subtle">
            New Product
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
        <button
          className="list-group-item list-group-item-action bg-white"
          data-bs-toggle="collapse"
          data-bs-target="#suppliersManagementCollapse"
          aria-expanded="false"
          aria-controls="suppliersManagementCollapse"
        >
          Suppliers Management
        </button>
        <div className="collapse" id="suppliersManagementCollapse">
          {/* <StyledLink to="/admin/suppliers/add" className="list-group-item text-center bg-secondary-subtle">
            New Suppliers
          </StyledLink> */}
          <StyledLink to="/admin/suppliers/manage" className="list-group-item text-center bg-secondary-subtle">
            Manage Suppliers
          </StyledLink>
        </div>
        <button
          className="list-group-item list-group-item-action bg-white"
          data-bs-toggle="collapse"
          data-bs-target="#warehouseManagementCollapse"
          aria-expanded="false"
          aria-controls="warehouseManagementCollapse"
        >
          Warehouse Management
        </button>
        <div className="collapse" id="warehouseManagementCollapse">
          <StyledLink to="/admin/warehouse/list" className="list-group-item text-center bg-secondary-subtle">
            Receipt list
          </StyledLink>
          <StyledLink to="/admin/warehouse/stock-in" className="list-group-item text-center bg-secondary-subtle">
            Stock in
          </StyledLink>
          {/* <StyledLink to="/admin/warehouse/manage" className="list-group-item text-center bg-secondary-subtle">
            Manage Warehouses
          </StyledLink> */}
        </div>
        <button
          className="list-group-item list-group-item-action bg-white"
          data-bs-toggle="collapse"
          data-bs-target="#permissionsManagementCollapse"
          aria-expanded="false"
          aria-controls="permissionsManagementCollapse"
        >
          Permissions Management
        </button>
        <div className="collapse" id="permissionsManagementCollapse">
          <StyledLink to="/admin/permission/add" className="list-group-item text-center bg-secondary-subtle">
            New Permissiosn
          </StyledLink>
          <StyledLink to="/admin/permission/manage" className="list-group-item text-center bg-secondary-subtle">
            Manage Permissions
          </StyledLink>
        </div>
        <button
          className="list-group-item list-group-item-action bg-danger"
          data-bs-toggle="collapse"
          data-bs-target="#feedbacksManagementCollapse"
          aria-expanded="false"
          aria-controls="feedbacksManagementCollapse"
        >
          Feedbacks Management
        </button>
        <div className="collapse" id="feedbacksManagementCollapse">
          <StyledLink to="/admin/feedback/manage" className="list-group-item text-center bg-secondary-subtle">
            Manage Feedbacks
          </StyledLink>
        </div>
      </div>
    </nav>
  );
}

export default AdminNav;

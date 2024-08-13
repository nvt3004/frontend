import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../components/admin/parts/AdminHeader';
import AdminNav from '../components/admin/parts/AdminNav';
import AdminFooter from '../components/admin/parts/AdminFooter';

function AdminLayout() {
  return (
    <div>
      <AdminHeader />
      <AdminNav />
      <main>
        <Outlet /> {/* Nơi chứa nội dung động */}
      </main>
      <AdminFooter />
    </div>
  );
}

export default AdminLayout;

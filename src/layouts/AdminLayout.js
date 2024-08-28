import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../components/admin/parts/AdminHeader';
import AdminNav from '../components/admin/parts/AdminNav';
import AdminFooter from '../components/admin/parts/AdminFooter';

function AdminLayout() {
  return (
    <div className="d-flex bg-primary-subtle">
      {/* Sidebar */}
      <aside className="col-3 col-md-2 bg-light p-3 d-flex flex-column" style={{ height: '100vh', overflowY: 'auto' }}>
        <AdminNav className="flex-grow-1" />
      </aside>

      {/* Content Area */}
      <div className="col-9 col-md-10 d-flex flex-column" style={{ height: '100vh' }}>
        {/* Header */}
        <header className="sticky-top bg-white">
          <AdminHeader />
        </header>

        {/* Main content */}
        <main className="flex-grow-1 d-flex flex-column" style={{
          backgroundColor: '#99FFCC',  // Ensure background color
          margin: '1rem',
        }}>
          <div className="flex-grow-1 p-4 bg-white rounded-1" style={{ 
            maxHeight: '100%', 
            overflowY: 'auto', // Allows scrolling if content overflows
          }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNav from '../components/admin/parts/AdminNav';
import Headder from '../components/admin/parts/NewParts/Head/Headder';

function AdminLayout() {
  return (
    <div className='bg-gray-1 font-14'>
      <div className='position-sticky top-0 shadow-sm' style={{ zIndex: 999 }}>
        <Headder />
      </div>
      <div className="d-flex scroll">
        <aside className="col-2 col-md-2 bg-white p-0 px-1 d-flex flex-column custom-border-right" style={{ height: '89.9vh', overflowY: 'auto' }}>
          <AdminNav className="flex-grow-1" />
        </aside>
        <div className='col-10 col-md-10 bg-body-tertiary' style={{ height: "89.9vh", overflowY: "auto" }}>
          <div className='container admin-layout'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;

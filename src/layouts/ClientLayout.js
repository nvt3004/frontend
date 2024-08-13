import React from 'react';
import { Outlet } from 'react-router-dom';
import ClientHeader from '../components/client/parts/ClientHeader';
import ClientNav from '../components/client/parts/ClientNav';
import ClientFooter from '../components/client/parts/ClientFooter';

function ClientLayout() {
  return (
    <div>
      <ClientHeader />
      <ClientNav />
      <main>
        <Outlet /> {/* Nơi chứa nội dung động */}
      </main>
      <ClientFooter />
    </div>
  );
}

export default ClientLayout;

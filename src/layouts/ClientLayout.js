import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/client/parts/Header';
import Cart from '../components/client/parts/Cart';
import Footer from '../components/client/parts/Footer';

function ClientLayout() {
  return (
    <div >
      <Header />
      <Cart />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default ClientLayout;

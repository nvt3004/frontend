import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/client/parts/Header";
import Footer from "../components/client/parts/Footer";
import ScrollToTop from "../components/utils/ScrollToTop";
function ClientLayout() {
  return (
    <div>
      <Header />
      <main>
        <ScrollToTop />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default ClientLayout;

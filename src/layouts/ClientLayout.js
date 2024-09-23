import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/client/parts/Navbar";
import Footer from "../components/client/parts/Footer";
import ScrollToTop from "../components/utils/ScrollToTop";
function ClientLayout() {
  return (
    <div>
      <Navbar />
      <main>
        <ScrollToTop />
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}

export default ClientLayout;

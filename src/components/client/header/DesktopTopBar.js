import React from "react";
import { Link } from "react-router-dom";
const TopBar = () => (
    <div className="top-bar">
    <div className="content-topbar flex-sb-m h-full container">
      <div className="left-top-bar">
        Free shipping for standard order over $100
      </div>
      <div className="right-top-bar flex-w h-full">
        <Link href="#" className="text-decoration-none flex-c-m trans-04 p-lr-25"> Help & FAQs </Link>
        <Link to="/account" className="text-decoration-none flex-c-m trans-04 p-lr-25"> My Account </Link>
        <Link href="#" className="text-decoration-none flex-c-m trans-04 p-lr-25"> EN </Link>
        <Link href="#" className="text-decoration-none flex-c-m trans-04 p-lr-25"> USD </Link>
      </div>
    </div>
  </div>
  );
  
  export default TopBar;
  
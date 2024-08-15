import React from "react";
import { Link } from "react-router-dom";
const MobileHeader = () => (
    <div className="wrap-header-mobile">
      <div className="logo-mobile">
        <Link to="/home">
          <img src="images/icons/logo4plus.png" alt="IMG-LOGO" />
        </Link>
      </div>
      <div className="wrap-icon-header flex-w flex-r-m m-r-15">
        <div className="icon-header-item cl2 hov-cl1 trans-04 p-r-11 js-show-modal-search">
          <i className="zmdi zmdi-search"></i>
        </div>
        <div className="icon-header-item cl2 hov-cl1 trans-04 p-r-11 p-l-10 icon-header-noti js-show-cart" data-notify="2">
          <i className="zmdi zmdi-shopping-cart"></i>
        </div>
        <Link href="#" className="dis-block icon-header-item cl2 hov-cl1 trans-04 p-r-11 p-l-10 icon-header-noti" data-notify="0">
          <i className="zmdi zmdi-favorite-outline"></i>
        </Link>
      </div>
      <div className="btn-show-menu-mobile hamburger hamburger--squeeze">
        <span className="hamburger-box">
          <span className="hamburger-inner"></span>
        </span>
      </div>
    </div>
  );
  
  export default MobileHeader;
  
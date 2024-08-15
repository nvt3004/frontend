import React, { useState } from "react";
import { Link } from "react-router-dom";
import Cart from "./Cart";

const MobileHeader = () => {
  const [openCart, setOpenCart] = useState(false);

  const handleOpenCart = () => {
    setOpenCart(true);
  };

  const handleCloseCart = () => {
    setOpenCart(false);
  };

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.5)",
      zIndex: 999,
    },
    cartContainer: {
      position: "fixed",
      height: "100vh",
      width: "390px",
      top: "0px",
      right: "0px",
      zIndex: 1000,
      background: "#fff",
    },
  };

  return (
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
        <button
          className="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 icon-header-noti js-show-cart"
          data-notify="2"
          style={styles.iconHeaderItem}
          onClick={handleOpenCart}
        >
          <i className="zmdi zmdi-shopping-cart"></i>
        </button>
        <Link
          href="#"
          className="dis-block icon-header-item cl2 hov-cl1 trans-04 p-r-11 p-l-10 icon-header-noti"
          data-notify="0"
        >
          <i className="zmdi zmdi-favorite-outline"></i>
        </Link>
      </div>
      <div className="btn-show-menu-mobile hamburger hamburger--squeeze">
        <span className="hamburger-box">
          <span className="hamburger-inner"></span>
        </span>
      </div>
      {openCart && (
        <>
          <div style={styles.overlay} onClick={handleCloseCart}></div>
          <div
            className="d-flex justify-content-center"
            style={styles.cartContainer}
          >
            <div className="container p-5">
              <div className="header-cart-title flex-w flex-sb-m p-b-8">
                <span className="mtext-103 cl2">Your Cart</span>
                <button
                  className="fs-35 lh-10 cl2 p-lr-5 pointer hov-cl1 trans-04"
                  onClick={handleCloseCart}
                >
                  <i className="zmdi zmdi-close"></i>
                </button>
              </div>
              <Cart />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MobileHeader;

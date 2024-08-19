import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
const DesktopMenu = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 990);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const styles = {
    wrapMenuDesktop: {
      position: "fixed",
      zIndex: 1000,
      backgroundColor: isScrolled ? "#fff" : "transparent",
      width: "100%",
      height: "70px",
      top: isScrolled ? "0px" : "40px",
      left: "0",
      borderBottom: isScrolled
        ? "1px solid rgba(0,0,0,0.2)"
        : "1px solid rgba(255,255,255,0.1)",
      transition:
        "height 0.3s, background-color 0.3s, top 0.3s, border-bottom 0.3s",
    },

    limiterMenuDesktop: {
      height: "100%",
      display: "flex",
      alignItems: "center",
      backgroundColor: "transparent",
    },
    logo: {
      display: "block",
    },
    menuDesktop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    mainMenu: {
      display: "flex",
      listStyle: "none",
    },
    wrapIconHeader: {
      display: "flex",
      alignItems: "center",
    },
    iconHeaderItem: {
      color: "#222",
      paddingLeft: "22px",
      paddingRight: "11px",
      cursor: "pointer",
    },
    customBg: {
      backgroundColor: "transparent",
    },
    zIndex: {
      zIndex: "1000",
    },
    zIndexLose: {
      zIndex: "999",
    },
  };

  return (
    <div>
      <div className="container-menu-desktop">
        <div className="top-bar">
          <div className="content-topbar flex-sb-m h-full container">
            <div className="left-top-bar">
              Free shipping for standard order over $100
            </div>
            <div className="right-top-bar flex-w h-full">
              <Link
                href="#"
                className="text-decoration-none flex-c-m trans-04 p-lr-25"
              >
                Help & FAQs{" "}
              </Link>
              <Link
                to="/account"
                className="text-decoration-none flex-c-m trans-04 p-lr-25"
              >
                My Account{" "}
              </Link>
              <Link
                href="#"
                className="text-decoration-none flex-c-m trans-04 p-lr-25"
              >
                EN{" "}
              </Link>
              <Link
                href="#"
                className="text-decoration-none flex-c-m trans-04 p-lr-25"
              >
                USD{" "}
              </Link>
            </div>
          </div>
        </div>
        <div className="wrap-menu-desktop" style={styles.wrapMenuDesktop}>
          <nav
            className="limiter-menu-desktop container"
            style={styles.limiterMenuDesktop}
          >
            <div>
              <Link
                to="/"
                className="text-decoration-none logo"
                style={styles.logo}
              >
                <img src="images/icons/logo4plus.png" alt="IMG-LOGO" />
              </Link>
            </div>

            <div className="menu-desktop p-0 " style={styles.menuDesktop}>
              <ul className="main-menu" style={styles.mainMenu}>
                <li className="active-menu">
                  <Link to="/" className="text-decoration-none">
                    Home
                  </Link>
                </li>

                <li>
                  <Link to="/product" className="text-decoration-none">
                    Shop
                  </Link>
                </li>

                <li className="label1" data-label1="hot">
                  <Link to="/shoping-cart" className="text-decoration-none">
                    Features
                  </Link>
                </li>

                <li>
                  <Link to="/blog" className="text-decoration-none">
                    Blog
                  </Link>
                </li>

                <li>
                  <Link to="/about" className="text-decoration-none">
                    About
                  </Link>
                </li>

                <li>
                  <Link to="/contact" className="text-decoration-none">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div
              className="wrap-icon-header flex-w flex-r-m"
              style={styles.wrapIconHeader}
            >
              {/* <!-- Button trigger modal --> */}
              <button
                type="button"
                className="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 "
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"
              >
                <i className="zmdi zmdi-search"></i>
              </button>
              <button
                className="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 icon-header-noti js-show-cart"
                data-notify="2"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasRight"
                aria-controls="offcanvasRight"
              >
                <i className="zmdi zmdi-shopping-cart"></i>
              </button>

              <Link
                to="/favourite"
                className="dis-block icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 icon-header-noti"
                data-notify="0"
              >
                <i className="zmdi zmdi-favorite-outline"></i>
              </Link>
            </div>
          </nav>
        </div>
      </div>
      {/* <!-- Header Mobile --> */}
      <div className="wrap-header-mobile">
        {/* <!-- Logo moblie --> */}
        <div className="logo-mobile ">
          <Link to="/home">
          <img src="images/icons/logo4plus.png" alt="IMG-LOGO" />
          </Link>
        </div>

        {/* <!-- Icon header --> */}
        <div className="wrap-icon-header flex-w flex-r-m m-r-15 ">
          <button
            type="button"
            className="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 "
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
          >
            <i className="zmdi zmdi-search"></i>
          </button>

          <button
            className="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 icon-header-noti js-show-cart"
            data-notify="2"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight"
            aria-controls="offcanvasRight"
          >
            <i className="zmdi zmdi-shopping-cart"></i>
          </button>

          <Link
            to="/favourite"
            className="dis-block icon-header-item cl2 hov-cl1 trans-04 p-r-11 p-l-10 icon-header-noti"
            data-notify="0"
          >
            <i className="zmdi zmdi-favorite-outline"></i>
          </Link>
        </div>

        {/* <!-- Button show menu --> */}
        <div className="btn-show-menu-mobile hamburger hamburger--squeeze ">
          <button
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseExample"
            aria-expanded="false"
            aria-controls="collapseExample"
          >
            <span className="hamburger-box">
              <span className="hamburger-inner"></span>
            </span>
          </button>
        </div>
      </div>
      {/* <!-- Menu Mobile --> */}
      {isSmallScreen ? (
        <div className="collapse" id="collapseExample">
          <div>
            <ul className="topbar-mobile m-0 p-0">
              <li>
                <div className="left-top-bar">
                  Free shipping for standard order over $100
                </div>
              </li>

              <li>
                <div className="right-top-bar flex-w h-full">
                  <Link href="#" className="text-decoration-none flex-c-m p-lr-10 trans-04">
                    Help & FAQs{" "}
                  </Link>

                  <Link to="/account" className="text-decoration-none flex-c-m p-lr-10 trans-04">
                    My Account{" "}
                  </Link>

                  <Link href="#" className="text-decoration-none flex-c-m p-lr-10 trans-04">
                    EN{" "}
                  </Link>

                  <Link href="#" className="text-decoration-none flex-c-m p-lr-10 trans-04">
                    USD{" "}
                  </Link>
                </div>
              </li>
            </ul>

            <ul className="main-menu-m m-0">
              <li>
                <Link to="/home" className="text-decoration-none">Home</Link>
              </li>

              <li>
                <Link to="/product" className="text-decoration-none">Shop</Link>
              </li>

              <li>
                <Link
                  to="/shoping-cart"
                  className="text-decoration-none label1 rs1"
                  data-label1="hot"
                >
                  Features
                </Link>
              </li>

              <li>
                <Link to="/blog" className="text-decoration-none">Blog</Link>
              </li>

              <li>
                <Link to="/about" className="text-decoration-none">About</Link>
              </li>

              <li>
                <Link to="/contact" className="text-decoration-none">Contact</Link>
              </li>
            </ul>
          </div>
        </div>
      ) : null}
      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl h-75">
          <div
            className="modal-content h-100 border border-0"
            style={styles.customBg}
          >
            <div className="d-flex align-items-center justify-content-center h-100">
              <div className="w-100">
                <div className="d-flex justify-content-end mb-3 w-auto ">
                  <button
                    type="button"
                    className="trans-04 btn-close bg-body-tertiary"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <form className="wrap-search-header flex-w p-l-15 w-auto">
                  <button className="flex-c-m trans-04">
                    <i className="zmdi zmdi-search"></i>
                  </button>
                  <input
                    className="plh3 w-auto"
                    type="text"
                    name="search"
                    placeholder="Search..."
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Offcanvas  right --> */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header p-5 pb-4">
          <span className="mtext-103 cl2">Your Cart</span>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="header-cart-wrapitem w-full custom-scrollbar">
            <li className="header-cart-item flex-w flex-t m-b-12 w-100">
              <div className="header-cart-item-img">
                <img src="images/item-cart-01.jpg" alt="IMG" />
              </div>
              <div className="header-cart-item-txt p-t-8">
                <Link
                  to="#"
                  className="text-decoration-none header-cart-item-name m-b-18 hov-cl1 trans-04"
                >
                  White Shirt Pleat
                </Link>
                <span className="header-cart-item-info">1 x $19.00</span>
              </div>
            </li>

            <li className="header-cart-item flex-w flex-t m-b-12">
              <div className="header-cart-item-img">
                <img src="images/item-cart-01.jpg" alt="IMG" />
              </div>
              <div className="header-cart-item-txt p-t-8">
                <Link
                  to="#"
                  className="text-decoration-none header-cart-item-name m-b-18 hov-cl1 trans-04"
                >
                  White Shirt Pleat
                </Link>
                <span className="header-cart-item-info">1 x $19.00</span>
              </div>
            </li>
            <li className="header-cart-item flex-w flex-t m-b-12">
              <div className="header-cart-item-img">
                <img src="images/item-cart-01.jpg" alt="IMG" />
              </div>
              <div className="header-cart-item-txt p-t-8">
                <Link
                  to="#"
                  className="text-decoration-none header-cart-item-name m-b-18 hov-cl1 trans-04"
                >
                  White Shirt Pleat
                </Link>
                <span className="header-cart-item-info">1 x $19.00</span>
              </div>
            </li>
            <li className="header-cart-item flex-w flex-t m-b-12">
              <div className="header-cart-item-img">
                <img src="images/item-cart-01.jpg" alt="IMG" />
              </div>
              <div className="header-cart-item-txt p-t-8">
                <Link
                  to="#"
                  className="text-decoration-none header-cart-item-name m-b-18 hov-cl1 trans-04"
                >
                  White Shirt Pleat
                </Link>
                <span className="header-cart-item-info">1 x $19.00</span>
              </div>
            </li>
            <li className="header-cart-item flex-w flex-t m-b-12">
              <div className="header-cart-item-img">
                <img src="images/item-cart-01.jpg" alt="IMG" />
              </div>
              <div className="header-cart-item-txt p-t-8">
                <Link
                  to="#"
                  className="text-decoration-none header-cart-item-name m-b-18 hov-cl1 trans-04"
                >
                  White Shirt Pleat
                </Link>
                <span className="header-cart-item-info">1 x $19.00</span>
              </div>
            </li>
          </ul>

          <div className="container">
            <div className="header-cart-total w-full p-tb-40">
              Total: $75.00
            </div>
            <div className="header-cart-buttons">
              <Link
                href="shoping-cart.html"
                className="text-decoration-none flex-c-m stext-101 cl0 size-107 bg3 bor2 hov-btn3 p-lr-15 trans-04 m-b-10"
              >
                View Cart
              </Link>
              <Link
                href="shoping-cart.html"
                className="text-decoration-none flex-c-m stext-101 cl0 size-107 bg3 bor2 hov-btn3 p-lr-15 trans-04 m-b-10"
              >
                Check Out
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopMenu;

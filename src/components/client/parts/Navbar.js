import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProfile } from "../../../services/api/OAuthApi";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { setWishlistCount } from "../../../store/actions/wishlistActions";

import { setCartCount } from "../../../store/actions/cartActions";
import productApi from "../../../services/api/ProductApi";
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [profile, setProfile] = useState(null);

  const [uri, setUri] = useState(window.location.pathname);

  const wishlistCount = useSelector((state) => state.wishlist.wishlistCount);
  const cartCount = useSelector((state) => state.cart.cartCount);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await productApi.getProductWish(); // Gọi API để lấy wishlist
        dispatch(setWishlistCount(data?.length));
      } catch (error) {
        console.log("Failed to fetch wishlist products", error);
      }
    };

    fetchWishlist();
    const fetchCart = async () => {
      try {
        const data = await productApi.getCartAll(); // Gọi API để lấy wishlist
        dispatch(setCartCount(data?.length));
      } catch (error) {
        console.log("Failed to fetch wishlist products", error);
      }
    };
    fetchCart();
    fetchWishlist();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();

        console.log("Profile data:", profileData);
        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    };

    fetchProfile();
  }, []);

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
    <header>
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
                Help & FAQs
              </Link>
              <Link
                to="/account"
                className="text-decoration-none flex-c-m trans-04 p-lr-25"
              >
                {profile && profile.listData && profile.listData.fullName
                  ? profile.listData.fullName
                  : "My Account"}
              </Link>
              <Link
                href="#"
                className="text-decoration-none flex-c-m trans-04 p-lr-25"
              >
                EN
              </Link>
              <Link
                href="#"
                className="text-decoration-none flex-c-m trans-04 p-lr-25"
              >
                USD
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
                <li
                  className={uri == "/" || uri == "/home" ? "active-menu" : ""}
                  onClick={() => {
                    setUri(window.location.pathname);
                  }}
                >
                  <Link to="/" className="text-decoration-none">
                    Home
                  </Link>
                </li>

                <li
                  className={uri == "/product" ? "active-menu" : ""}
                  onClick={() => {
                    setUri(window.location.pathname);
                  }}
                >
                  <Link to="/product" className="text-decoration-none">
                    Shop
                  </Link>
                </li>

                <li
                  className={`${
                    uri == "/shoping-cart" ? "active-menu " : ""
                  } label1`}
                  data-label1="hot"
                  onClick={() => {
                    setUri(window.location.pathname);
                  }}
                >
                  <Link to="/shoping-cart" className="text-decoration-none">
                    Features
                  </Link>
                </li>

                <li
                  className={uri == "/blog" ? "active-menu" : ""}
                  onClick={() => {
                    setUri(window.location.pathname);
                  }}
                >
                  <Link to="/blog" className="text-decoration-none">
                    Blog
                  </Link>
                </li>

                <li
                  className={uri == "/about" ? "active-menu" : ""}
                  onClick={() => {
                    setUri(window.location.pathname);
                  }}
                >
                  <Link to="/about" className="text-decoration-none">
                    About
                  </Link>
                </li>

                <li
                  className={uri == "/contact" ? "active-menu" : ""}
                  onClick={() => {
                    setUri(window.location.pathname);
                  }}
                >
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
              >
                <i className="zmdi zmdi-search"></i>
              </button>
              <button
                className="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 icon-header-noti js-show-cart"
                data-notify={cartCount}
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasRight"
                aria-controls="offcanvasRight"
              >
                <i className="zmdi zmdi-shopping-cart"></i>
              </button>

              <Link
                to="/wishlist"
                className="dis-block icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 icon-header-noti"
                data-notify={wishlistCount}
              >
                <i className={`zmdi  ${
                  uri == "/wishlist" ? "zmdi-favorite text-717fe0" : "zmdi-favorite-outline"
                } `}></i>
              </Link>

              <div className="btn-group">
                <button
                  type="button"
                  className="dis-block icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 "
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="zmdi zmdi-account-o"></i>
                </button>
                <ul className="dropdown-menu rounded-0">
                  <li>
                    <Link to="/account" className="dropdown-item stext-111">
                      {profile && profile.listData && profile.listData.fullName
                        ? profile.listData.fullName
                        : "Account"}
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item stext-111" to="/auth/login">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item stext-111"
                      to="/auth/register"
                    >
                      Register
                    </Link>
                  </li>
                </ul>
              </div>
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
          >
            <i className="zmdi zmdi-search"></i>
          </button>

          <button
            className="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 icon-header-noti js-show-cart"
            data-notify={cartCount}
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight"
            aria-controls="offcanvasRight"
          >
            <i className="zmdi zmdi-shopping-cart"></i>
          </button>

          <Link
            to="/wishlist"
            className="dis-block icon-header-item cl2 hov-cl1 trans-04 p-r-11 p-l-10 icon-header-noti"
            data-notify={wishlistCount}
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
                  <Link
                    href="#"
                    className="text-decoration-none flex-c-m p-lr-10 trans-04"
                  >
                    Help & FAQs
                  </Link>

                  <Link
                    to="/account"
                    className="text-decoration-none flex-c-m p-lr-10 trans-04"
                  >
                    {profile && profile.listData && profile.listData.fullName
                      ? profile.listData.fullName
                      : "My Account"}
                  </Link>

                  <Link
                    href="#"
                    className="text-decoration-none flex-c-m p-lr-10 trans-04"
                  >
                    EN
                  </Link>

                  <Link
                    href="#"
                    className="text-decoration-none flex-c-m p-lr-10 trans-04"
                  >
                    USD
                  </Link>
                </div>
              </li>
            </ul>
            <nav>
              <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <button
                  className="nav-link active"
                  id="nav-home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-home"
                  type="button"
                  role="tab"
                  aria-controls="nav-home"
                  aria-selected="true"
                >
                  Menu
                </button>
                <button
                  className="nav-link"
                  id="nav-profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-profile"
                  type="button"
                  role="tab"
                  aria-controls="nav-profile"
                  aria-selected="false"
                >
                  {profile && profile.listData && profile.listData.fullName
                    ? profile.listData.fullName
                    : "Account"}
                </button>
              </div>
            </nav>
            <div className="tab-content" id="nav-tabContent">
              <div
                className="tab-pane fade show active"
                id="nav-home"
                role="tabpanel"
                aria-labelledby="nav-home-tab"
                tabIndex="0"
              >
                <ul className="main-menu-m m-0">
                  <li>
                    <Link to="/home" className="text-decoration-none">
                      Home
                    </Link>
                  </li>

                  <li>
                    <Link to="/product" className="text-decoration-none">
                      Shop
                    </Link>
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
                className="tab-pane fade"
                id="nav-profile"
                role="tabpanel"
                aria-labelledby="nav-profile-tab"
                tabIndex="0"
              >
                <ul className="main-menu-m m-0">
                  <li>
                    <Link to="/account" className="text-decoration-none">
                      Account
                    </Link>
                  </li>

                  <li>
                    <Link to="/auth/login" className="text-decoration-none">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/auth/register" className="text-decoration-none">
                      Register
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : null}

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
    </header>
  );
};

export default Navbar;

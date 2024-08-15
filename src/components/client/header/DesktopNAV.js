import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Avatar from "../../../assets/images/userDefaut.jpg";
const DesktopMenu = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [userAvatar, setUserAvatar] = useState(Avatar);

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
      zIndex: 1100,
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
  };

  return (
    <div className="wrap-menu-desktop" style={styles.wrapMenuDesktop}>
      <nav
        className="limiter-menu-desktop container"
        style={styles.limiterMenuDesktop}
      >
        <div>
          <Link to="/" className="logo" style={styles.logo}>
            <img src="images/icons/logo4plus.png" alt="IMG-LOGO" />
          </Link>
        </div>

        <div className="menu-desktop p-0 " style={styles.menuDesktop}>
          <ul className="main-menu" style={styles.mainMenu}>
            <li className="active-menu">
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/product">Shop</Link>
            </li>

            <li className="label1" data-label1="hot">
              <Link to="/shoping-cart">Features</Link>
            </li>

            <li>
              <Link to="/blog">Blog</Link>
            </li>

            <li>
              <Link to="/about">About</Link>
            </li>

            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div
          className="wrap-icon-header flex-w flex-r-m"
          style={styles.wrapIconHeader}
        >
          <div
            className="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 js-show-modal-search"
            style={styles.iconHeaderItem}
          >
            <i className="zmdi zmdi-search"></i>
          </div>

          <div
            className="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 icon-header-noti js-show-cart"
            data-notify="2"
            style={styles.iconHeaderItem}
          >
            <i className="zmdi zmdi-shopping-cart"></i>
          </div>

          <Link
            to="/favourite"
            className="dis-block icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 icon-header-noti"
            data-notify="0"
            style={styles.iconHeaderItem}
          >
            <i className="zmdi zmdi-favorite-outline"></i>
          </Link>
          <Link to="/account">
            <img
            className="ml-3"
              src={userAvatar}
              style={{ borderRadius: "100%", width: "30px" }}
              alt="UserIMG"
            />
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default DesktopMenu;

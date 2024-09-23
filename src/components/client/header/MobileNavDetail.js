import React from "react";
import { Link } from "react-router-dom";

const MobileMenu = () => (
    <div className="menu-mobile">
      <ul className="topbar-mobile">
        <li>
          <div className="left-top-bar">
            Free shipping for standard order over $100
          </div>
        </li>
        <li>
          <div className="right-top-bar flex-w h-full">
            <Link href="#" className="flex-c-m p-lr-10 trans-04"> Help & FAQs </Link>
            <Link href="#" className="flex-c-m p-lr-10 trans-04"> My Account </Link>
            <Link href="#" className="flex-c-m p-lr-10 trans-04"> EN </Link>
            <Link href="#" className="flex-c-m p-lr-10 trans-04"> USD </Link>
          </div>
        </li>
      </ul>
      <ul className="main-menu-m">
        <li>
          <a href="index.html">Home</a>
          <ul className="sub-menu-m">
            <li><a href="index.html">Homepage 1</a></li>
            <li><a href="home-02.html">Homepage 2</a></li>
            <li><a href="home-03.html">Homepage 3</a></li>
          </ul>
          <span className="arrow-main-menu-m">
            <i className="fa fa-angle-right" aria-hidden="true"></i>
          </span>
        </li>
        <li><a href="product.html">Shop</a></li>
        <li><a href="shoping-cart.html" className="label1 rs1" data-label1="hot">Features</a></li>
        <li><a href="blog.html">Blog</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
    </div>
  );
  
  export default MobileMenu;
  
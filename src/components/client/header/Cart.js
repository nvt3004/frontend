import React from "react";
import { Link } from "react-router-dom";
import "../../../assets/style/custom-scroll.css"
const Cart = ()=> {
  return (
    <div className="header-cart-content flex-w">
      <ul className="header-cart-wrapitem w-full custom-scrollbar">
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

      <div className="w-full">
        <div className="header-cart-total w-full p-tb-40">Total: $75.00</div>
        <div className="header-cart-buttons flex-w w-full">
          <Link
            href="shoping-cart.html"
            className="text-decoration-none flex-c-m stext-101 cl0 size-107 bg3 bor2 hov-btn3 p-lr-15 trans-04 m-r-8 m-b-10"
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
  );
}

export default Cart;

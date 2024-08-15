import React from "react";
import { Link } from "react-router-dom";

function Cart() {
  return (
    <div className="header-cart-content flex-w">
      <style>
        {`
          .custom-scrollbar {
            height: 55vh;
            overflow: auto;
            overflow-x: hidden;
          }

          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #888; 
            border-radius: 10px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #555;
          }

          .custom-scrollbar::-webkit-scrollbar-track {
            background-color: #fff; 
            border-radius: 10px; 
          }
        `}
      </style>

      <ul className="header-cart-wrapitem w-full custom-scrollbar">
        <li className="header-cart-item flex-w flex-t m-b-12">
          <div className="header-cart-item-img">
            <img src="images/item-cart-01.jpg" alt="IMG" />
          </div>
          <div className="header-cart-item-txt p-t-8">
            <Link
              to="#"
              className="header-cart-item-name m-b-18 hov-cl1 trans-04"
            >
              White Shirt Pleat
            </Link>
            <span className="header-cart-item-info">1 x $19.00</span>
          </div>
        </li>
        <li className="header-cart-item flex-w flex-t m-b-12">
          <div className="header-cart-item-img">
            <img src="images/item-cart-02.jpg" alt="IMG" />
          </div>
          <div className="header-cart-item-txt p-t-8">
            <Link
              to="#"
              className="header-cart-item-name m-b-18 hov-cl1 trans-04"
            >
              Converse All Star
            </Link>
            <span className="header-cart-item-info">1 x $39.00</span>
          </div>
        </li>
        <li className="header-cart-item flex-w flex-t m-b-12">
          <div className="header-cart-item-img">
            <img src="images/item-cart-02.jpg" alt="IMG" />
          </div>
          <div className="header-cart-item-txt p-t-8">
            <Link
              to="#"
              className="header-cart-item-name m-b-18 hov-cl1 trans-04"
            >
              Converse All Star
            </Link>
            <span className="header-cart-item-info">1 x $39.00</span>
          </div>
        </li>
        <li className="header-cart-item flex-w flex-t m-b-12">
          <div className="header-cart-item-img">
            <img src="images/item-cart-02.jpg" alt="IMG" />
          </div>
          <div className="header-cart-item-txt p-t-8">
            <Link
              to="#"
              className="header-cart-item-name m-b-18 hov-cl1 trans-04"
            >
              Converse All Star
            </Link>
            <span className="header-cart-item-info">1 x $39.00</span>
          </div>
        </li>
        <li className="header-cart-item flex-w flex-t m-b-12">
          <div className="header-cart-item-img">
            <img src="images/item-cart-02.jpg" alt="IMG" />
          </div>
          <div className="header-cart-item-txt p-t-8">
            <Link
              to="#"
              className="header-cart-item-name m-b-18 hov-cl1 trans-04"
            >
              Converse All Star
            </Link>
            <span className="header-cart-item-info">1 x $39.00</span>
          </div>
        </li>
        <li className="header-cart-item flex-w flex-t m-b-12">
          <div className="header-cart-item-img">
            <img src="images/item-cart-02.jpg" alt="IMG" />
          </div>
          <div className="header-cart-item-txt p-t-8">
            <Link
              to="#"
              className="header-cart-item-name m-b-18 hov-cl1 trans-04"
            >
              Converse All Star
            </Link>
            <span className="header-cart-item-info">1 x $39.00</span>
          </div>
        </li>
      </ul>

      <div className="w-full">
        <div className="header-cart-total w-full p-tb-40">Total: $75.00</div>
        <div className="header-cart-buttons flex-w w-full">
          <a
            href="shoping-cart.html"
            className="flex-c-m stext-101 cl0 size-107 bg3 bor2 hov-btn3 p-lr-15 trans-04 m-r-8 m-b-10"
          >
            View Cart
          </a>
          <a
            href="shoping-cart.html"
            className="flex-c-m stext-101 cl0 size-107 bg3 bor2 hov-btn3 p-lr-15 trans-04 m-b-10"
          >
            Check Out
          </a>
        </div>
      </div>
    </div>
  );
}

export default Cart;

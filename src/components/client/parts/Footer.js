import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  // Tính toán năm hiện tại
  const year = new Date().getFullYear();

  return (
    <div>
      {/* Footer */}
      <footer className="bg3 p-t-75 p-b-32">
        <div className="container">
          <div className="row">
            <div className="col-sm-6 col-lg-3 p-b-50">
              <h4 className="stext-301 cl0 p-b-30">Categories</h4>

              <div>
                <div className="p-b-10">
                  <Link to="#" className="text-decoration-none stext-107 cl7 hov-cl1 trans-04">Women</Link>
                </div>

                <div className="p-b-10">
                  <Link to="#" className="text-decoration-none stext-107 cl7 hov-cl1 trans-04">Men</Link>
                </div>

                <div className="p-b-10">
                  <Link to="#" className="text-decoration-none stext-107 cl7 hov-cl1 trans-04">Shoes</Link>
                </div>

                <div className="p-b-10">
                  <Link to="#" className="text-decoration-none stext-107 cl7 hov-cl1 trans-04">Watches</Link>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3 p-b-50">
              <h4 className="stext-301 cl0 p-b-30">Help</h4>

              <div>
                <div className="p-b-10">
                  <Link to="#" className="text-decoration-none stext-107 cl7 hov-cl1 trans-04">Track Order</Link>
                </div>

                <div className="p-b-10">
                  <Link to="#" className="text-decoration-none stext-107 cl7 hov-cl1 trans-04">Returns</Link>
                </div>

                <div className="p-b-10">
                  <Link to="#" className="text-decoration-none stext-107 cl7 hov-cl1 trans-04">Shipping</Link>
                </div>

                <div className="p-b-10">
                  <Link to="#" className="text-decoration-none stext-107 cl7 hov-cl1 trans-04">FAQs</Link>
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3 p-b-50">
              <h4 className="stext-301 cl0 p-b-30">GET IN TOUCH</h4>

              <p className="stext-107 cl7 size-201">
                Any questions? Let us know in store at 8th floor, 379 Hudson St,
                New York, NY 10018 or call us on (+1) 11 222 2222
              </p>

              <div className="p-t-27">
                <Link to="#" className="fs-18 cl7 hov-cl1 trans-04 m-r-16">
                  <i className="fa fa-facebook"></i>
                </Link>

                <Link to="#" className="fs-18 cl7 hov-cl1 trans-04 m-r-16">
                  <i className="fa fa-instagram"></i>
                </Link>

                <Link to="#" className="fs-18 cl7 hov-cl1 trans-04 m-r-16">
                  <i className="fa fa-pinterest-p"></i>
                </Link>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3 p-b-50">
              <h4 className="stext-301 cl0 p-b-30">Newsletter</h4>

              <form>
                <div className="wrap-input1 w-full p-b-4">
                  <input
                    className="input1 bg-none plh1 stext-107 cl7"
                    type="text"
                    name="email"
                    placeholder="email@example.com"
                  />
                  <div className="focus-input1 trans-04"></div>
                </div>

                <div className="p-t-18">
                  <button
                    className="flex-c-m stext-101 cl0 size-103 bg1 bor1 hov-btn2 p-lr-15 trans-04"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="p-t-40">
            <div className="flex-c-m flex-w p-b-18">
              <Link to="#" className="m-all-1">
                <img src="images/icons/icon-pay-01.png" alt="ICON-PAY" />
              </Link>

              <Link to="#" className="m-all-1">
                <img src="images/icons/icon-pay-02.png" alt="ICON-PAY" />
              </Link>

              <Link to="#" className="m-all-1">
                <img src="images/icons/icon-pay-03.png" alt="ICON-PAY" />
              </Link>

              <Link to="#" className="m-all-1">
                <img src="images/icons/icon-pay-04.png" alt="ICON-PAY" />
              </Link>

              <Link to="#" className="m-all-1">
                <img src="images/icons/icon-pay-05.png" alt="ICON-PAY" />
              </Link>
            </div>

            <p className="stext-107 cl6 txt-center">
  &copy; {year} All rights reserved | Proudly crafted by Step to Future
</p>

          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;

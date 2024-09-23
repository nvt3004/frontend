import React from "react";
import { Link } from "react-router-dom";
const WishList = () => {
  const style ={
    m:{marginTop:"80px"}
  };
  return (
    
    <div style={style.m}>
      {/* <!-- Product --> */}
      <section className="bg0 p-t-23 p-b-140">
        <div className="container">
          <div className="p-b-10 mb-4">
            <h3 className="ltext-103 cl5">Wish Lists</h3>
          </div>
          <div className="row isotope-grid">
            <div className="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item women">
              {/* <!-- Block2 --> */}
              <div className="block2">
                <div className="block2-pic hov-img0">
                  <img src="images/product-01.jpg" alt="IMG-PRODUCT" />

                  <Link
                    href="#"
                    className="text-decoration-none block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1"
                  >
                    Quick View
                  </Link>
                </div>

                <div className="block2-txt flex-w flex-t p-t-14">
                  <div className="block2-txt-child1 flex-col-l">
                    <Link
                      to="/product-detail"
                      className="text-decoration-none stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
                    >
                      Esprit Ruffle Shirt
                    </Link>

                    <span className="stext-105 cl3"> $16.64 </span>
                  </div>

                  <div className="block2-txt-child2 flex-r p-t-3">
                    <Link
                      href="#"
                      className="btn-addwish-b2 dis-block pos-relative js-addwish-b2"
                    >
                       <img
                        className="icon-heart1 dis-block trans-04"
                        src="images/icons/icon-heart-01.png"
                        alt="ICON"
                      />
                      <img
                        className="icon-heart1 dis-block trans-04 ab-t-l"
                        src="images/icons/icon-heart-02.png"
                        alt="ICON"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item women">
              {/* <!-- Block2 --> */}
              <div className="block2">
                <div className="block2-pic hov-img0">
                  <img src="images/product-02.jpg" alt="IMG-PRODUCT" />

                  <Link
                    href="#"
                    className="text-decoration-none block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 js-show-modal1"
                  >
                    Quick View
                  </Link>
                </div>

                <div className="block2-txt flex-w flex-t p-t-14">
                  <div className="block2-txt-child1 flex-col-l">
                    <Link
                      to="/product-detail"
                      className="text-decoration-none stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
                    >
                      Esprit Ruffle Shirt
                    </Link>

                    <span className="stext-105 cl3"> $16.64 </span>
                  </div>

                  <div className="block2-txt-child2 flex-r p-t-3">
                    <Link
                      href="#"
                      className="btn-addwish-b2 dis-block pos-relative js-addwish-b2"
                    >
                      <img
                        className="icon-heart1 dis-block trans-04"
                        src="images/icons/icon-heart-01.png"
                        alt="ICON"
                      />
                      <img
                        className="icon-heart1 dis-block trans-04 ab-t-l"
                        src="images/icons/icon-heart-02.png"
                        alt="ICON"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Back to top --> */}
      <div className="btn-back-to-top" id="myBtn">
        <span className="symbol-btn-back-to-top">
          <i className="zmdi zmdi-chevron-up"></i>
        </span>
      </div>
    </div>
  );
};
export default WishList;

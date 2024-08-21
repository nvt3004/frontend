import React from "react";
import Slider from "../../components/client/homeItem/Slider";
import { Link } from "react-router-dom";
import QuickViewProdDetail from "../../components/client/Modal/QuickViewProdDetail";
const Home = () => {
  // SuccessAlert({ title: 'Product Added', text: 'The product was added to your cart!' });
  return (
    <div>
      <Slider />

      {/* <!-- Banner --> */}
      <div className="sec-banner bg0 p-t-80">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-xl-4 p-b-30 m-lr-auto">
              {/* <!-- Block1 --> */}
              <div className="block1 wrap-pic-w">
                <img src="images/banner-01.jpg" alt="IMG-BANNER" />

                <Link
                  to="/product"
                  className="text-decoration-none block1-txt ab-t-l s-full flex-col-l-sb p-lr-38 p-tb-34 trans-03 respon3"
                >
                  <div className="block1-txt-child1 flex-col-l">
                    <span className="block1-name ltext-102 trans-04 p-b-8">
                      Women
                    </span>

                    <span className="block1-info stext-102 trans-04">
                      Spring 2024
                    </span>
                  </div>

                  <div className="block1-txt-child2 p-b-4 trans-05">
                    <div className="block1-link stext-101 cl0 trans-09">
                      Shop Now
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="col-md-6 col-xl-4 p-b-30 m-lr-auto">
              {/* <!-- Block1 --> */}
              <div className="block1 wrap-pic-w">
                <img src="images/banner-02.jpg" alt="IMG-BANNER" />

                <Link
                  to="/product"
                  className="text-decoration-none block1-txt ab-t-l s-full flex-col-l-sb p-lr-38 p-tb-34 trans-03 respon3"
                >
                  <div className="block1-txt-child1 flex-col-l">
                    <span className="block1-name ltext-102 trans-04 p-b-8">
                      Men
                    </span>

                    <span className="block1-info stext-102 trans-04">
                      Spring 2024
                    </span>
                  </div>

                  <div className="block1-txt-child2 p-b-4 trans-05">
                    <div className="block1-link stext-101 cl0 trans-09">
                      Shop Now
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="col-md-6 col-xl-4 p-b-30 m-lr-auto">
              {/* <!-- Block1 --> */}
              <div className="block1 wrap-pic-w">
                <img src="images/banner-03.jpg" alt="IMG-BANNER" />

                <Link
                  to="/product"
                  className="text-decoration-none block1-txt ab-t-l s-full flex-col-l-sb p-lr-38 p-tb-34 trans-03 respon3"
                >
                  <div className="block1-txt-child1 flex-col-l">
                    <span className="block1-name ltext-102 trans-04 p-b-8">
                      Accessories
                    </span>

                    <span className="block1-info stext-102 trans-04">
                      New Trend
                    </span>
                  </div>

                  <div className="block1-txt-child2 p-b-4 trans-05">
                    <div className="block1-link stext-101 cl0 trans-09">
                      Shop Now
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-5">
        <div className="p-b-10 w-100 ">
          <h3 className="ltext-103 cl5">Product Overview</h3>
        </div>
        {/* <!-- Related Products --> */}
        <section className="sec-relate-product bg0 p-t-45 p-b-64">
          <div className="p-3 pt-0 pb-0">
            {/* <!-- Slide2 --> */}
            <div className="wrap-slick2">
              <div className="row isotope-grid">
                <div className="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item women">
                  {/* <!-- Block2 --> */}
                  <div className="block2">
                    <div className="block2-pic hov-img0">
                      <img src="images/product-01.jpg" alt="IMG-PRODUCT" />

                      {/* Quick View */}
                      <QuickViewProdDetail />
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
                            className="icon-heart2 dis-block trans-04 ab-t-l"
                            src="images/icons/icon-heart-02.png"
                            alt="ICON"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                {/* ADD PRODUCT chỗ này */}
              </div>
            </div>
            {/* <!-- Load more --> */}
            <div className="flex-c-m flex-w w-full">
              <Link
                href="#"
                className="text-decoration-none flex-c-m stext-101 cl5 size-103 bg2 bor1 hov-btn1 p-lr-15 trans-04"
              >
                Load More
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;

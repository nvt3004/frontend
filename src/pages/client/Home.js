import React from "react";
import Slider from "../../components/client/homeItem/Slider";
import Product from "./Product";
import { Link } from "react-router-dom";
const Home = () => {
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
                      Spring 2018
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
                      Spring 2018
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
        <div className="p-b-10 w-100">
          <h3 className="ltext-103 cl5">Product Overview</h3>
        </div>
      </div>
      <Product />
    </div>
  );
};

export default Home;

import React,{useState} from "react";
import { Link } from "react-router-dom";

const QuickViewProdDetail = () => {
    // Khởi tạo state cho số lượng sản phẩm
  const [quantity, setQuantity] = useState(1);

  // Hàm giảm số lượng
  const handleDecrease = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  // Hàm tăng số lượng
  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  // Hàm xử lý khi người dùng nhập số lượng trực tiếp
  const handleChange = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };
  const style = {
    w500: { width: "100%" },
    wh: { width: "100px", height: "126px" },
  };
  return (
    <div>
      {/* <!-- Modal --> */}
      {/* <!-- Button trigger modal --> */}
      <button
        type="button"
        className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 text-decoration-none "
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Quick View
      </button>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content rounded-0">
            <div className="modal-header pb-1 pt-2">
              <h1
                className="modal-title flex-c-m stext-101 cl5 size-103  p-lr-15"
                id="exampleModalLabel"
              >
                Quick view product details
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 col-lg-7 p-b-30">
                  <div
                    id="productCarousel"
                    className="carousel slide carousel-fade"
                  >
                    <div className="row m-0">
                      <div className="col-md-2 me-2">
                        {/* Thumbnail Images as Indicators */}
                        <div className="carousel-indicators flex-column h-100 m-0 overflow-auto custom-scrollbar">
                          <button
                            type="button"
                            data-bs-target="#productCarousel"
                            data-bs-slide-to="0"
                            className="active"
                            aria-label="Slide 1"
                            style={style.wh}
                          >
                            <img
                              src="images/product-detail-01.jpg"
                              className="d-block w-100 h-full"
                              alt=""
                            />
                          </button>
                          <button
                            type="button"
                            data-bs-target="#productCarousel"
                            data-bs-slide-to="1"
                            aria-label="Slide 2"
                            style={style.wh}
                          >
                            <img
                              src="images/product-detail-02.jpg"
                              className="d-block w-100"
                              alt=""
                            />
                          </button>
                          <button
                            type="button"
                            data-bs-target="#productCarousel"
                            data-bs-slide-to="2"
                            aria-label="Slide 3"
                            style={style.wh}
                          >
                            <img
                              src="images/product-detail-03.jpg"
                              className="d-block w-100 "
                              alt=""
                            />
                          </button>
                        </div>
                      </div>

                      <div className="col-md-10 p-0">
                        {/* Large Image Carousel */}
                        <div className="carousel-inner" style={style.w500}>
                          <div className="carousel-item active">
                            <img
                              src="images/product-detail-01.jpg"
                              className="d-block w-100"
                              alt=""
                            />
                          </div>
                          <div className="carousel-item">
                            <img
                              src="images/product-detail-02.jpg"
                              className="d-block w-100"
                              alt=""
                            />
                          </div>
                          <div className="carousel-item">
                            <img
                              src="images/product-detail-03.jpg"
                              className="d-block w-100"
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-5 p-b-30">
                  <div className="p-r-50 p-t-5 p-lr-0-lg">
                    <h4 className="mtext-105 cl2 js-name-detail p-b-14">
                      Lightweight Jacket
                    </h4>

                    <span className="mtext-106 cl2">$58.79</span>

                    <p className="stext-102 cl3 p-t-23">
                      Nulla eget sem vitae eros pharetra viverra. Nam vitae
                      luctus ligula. Mauris consequat ornare feugiat.
                    </p>

                    {/* <!--  --> */}
                    <div className="p-t-33">
                      <div className="flex-w flex-r-m p-b-10">
                        <div className="size-203 flex-c-m respon6">Size</div>

                        <div className="size-204 respon6-next">
                          <div>
                            <select
                              className="pt-3 pb-3 w-100 border border-1 p-2 rounded-0 form-select stext-111"
                              aria-label="Default select example"
                            >
                              <option>Choose an option</option>
                              <option value="1">Size S</option>
                              <option value="2">Size M</option>
                              <option value="3">Size L</option>
                              <option value="4">Size XL</option>
                            </select>
                            <div className="dropDownSelect2"></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex-w flex-r-m p-b-10">
                        <div className="size-203 flex-c-m respon6">Color</div>

                        <div className="size-204 respon6-next">
                          <div>
                            <select
                              className="pt-3 pb-3 w-100 border border-1 p-2 rounded-0 form-select stext-111"
                              aria-label="Default select example"
                            >
                              <option>Choose an option</option>
                              <option value={"1"}>Red</option>
                              <option value={"2"}>Blue</option>
                              <option value={"3"}>White</option>
                              <option value={"4"}>Grey</option>
                            </select>
                            <div className="dropDownSelect2"></div>
                          </div>
                        </div>
                      </div>

                      <div className="flex-w flex-r-m p-b-10">
                        <div className="size-204 flex-w flex-m respon6-next">
                          <div className="wrap-num-product flex-w m-r-20 m-tb-10">
                            <div
                              className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m"
                              onClick={handleDecrease}
                            >
                              <i className="fs-16 zmdi zmdi-minus"></i>
                            </div>

                            <input
                              className="mtext-104 cl3 txt-center num-product"
                              type="number"
                              name="num-product1"
                              value={quantity}
                              onChange={handleChange}
                            />

                            <div
                              className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m"
                              onClick={handleIncrease}
                            >
                              <i className="fs-16 zmdi zmdi-plus"></i>
                            </div>
                          </div>

                          <button className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04 js-addcart-detail">
                            Add to cart
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* <!--  --> */}
                    <div className="flex-w flex-m p-l-100 p-t-40 respon7">
                      <div className="flex-m bor9 p-r-10 m-r-11">
                        <Link
                          href="#"
                          className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 js-addwish-detail tooltip100"
                          data-tooltip="Add to Wishlist"
                        >
                          <i className="zmdi zmdi-favorite"></i>
                        </Link>
                      </div>

                      <Link
                        href="#"
                        className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100"
                        data-tooltip="Facebook"
                      >
                        <i className="fa fa-facebook"></i>
                      </Link>

                      <Link
                        href="#"
                        className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100"
                        data-tooltip="Twitter"
                      >
                        <i className="fa fa-twitter"></i>
                      </Link>

                      <Link
                        href="#"
                        className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100"
                        data-tooltip="Google Plus"
                      >
                        <i className="fa fa-google-plus"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default QuickViewProdDetail;
import React, { useEffect, useState } from "react";
import Slider from "../../components/client/homeItem/Slider";
import { Link } from "react-router-dom";
import productApi from "../../services/api/ProductApi";
const Home = () => {
  // SuccessAlert({ title: 'Product Added', text: 'The product was added to your cart!' });

  // const handleAction = async () => {
  //   const confirmed = await ConfirmAlert({
  //     title: "Delete this item?",
  //     text: "This action cannot be undone.",
  //     confirmText: "Delete",
  //     cancelText: "Cancel",
  //   });

  //   if (confirmed) {
  //     console.log("Action confirmed!");
  //     // Thực hiện hành động khi người dùng xác nhận
  //   } else {
  //     console.log("Action cancelled!");
  //     // Thực hiện hành động khi người dùng hủy
  //   }
  // };
  const [Products, setProducts] = useState([]);
  const [ProductDetail, setProductDetail] = useState();
  const [ErrorCode] = useState("204");
  const [ErrorMessage] = useState("No products found");

  useEffect(() => {
    const fetchTopProduct = async () => {
      try {
        const response = await productApi.getTopProducts();
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    fetchTopProduct();
  }, []);
  const getProductDetail = async (id) => {
    try {
      const response = await productApi.getProductDetail(id);
      setProductDetail(response.data.data);
    } catch (error) {
      console.error("Error fetching product:", error.message);
    }
  };

  const handleProductClick = (id) => {
    getProductDetail(id);
  };

  const style = {
    w500: { width: "100%" },
    wh: { width: "100px", height: "126px" },
  };
  const handleCheckColorAndSize = (key, value) => {
    let attribute = [];
    ProductDetail.versions.forEach(element => {
      
    });
  };
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
                {!Products || Products.length ? (
                  Products.map((product, index) => (
                    <div
                      key={index}
                      className="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item women"
                    >
                      <div className="block2">
                        <div className="block2-pic hov-img0">
                          <img src={product.imgName} alt="IMG-PRODUCT" />
                          {/* Quick View */}
                          <button
                            type="button"
                            className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 text-decoration-none "
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                            onClick={() => handleProductClick(product.id)}
                          >
                            Quick View
                          </button>
                        </div>

                        <div className="block2-txt flex-w flex-t p-t-14">
                          <div className="block2-txt-child1 flex-col-l">
                            <Link
                              to={`/product-detail/${product.id}`}
                              className="text-decoration-none stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
                            >
                              {product.name}
                            </Link>

                            <span className="stext-105 cl3">
                              {`${
                                product.minPrice == null ? 0 : product.minPrice
                              }VND ~ ${product.maxPrice}VND`}
                            </span>
                          </div>

                          <div className="block2-txt-child2 flex-r p-t-3">
                            <Link
                              to="#"
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
                  ))
                ) : (
                  <div className="d-flex justify-content-center mt-5 mb-5">
                    <div className=" pt-5 pb-5 opacity-50">
                      <h3 className="display-6 fw-bold">{`Code: ${ErrorCode}`}</h3>
                      <p className="fs-4 text-muted mt-3">
                        Message: {ErrorMessage}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* <!-- Load more --> */}
            <div className="flex-c-m flex-w w-full">
              <Link
                to="/product"
                className="text-decoration-none flex-c-m stext-101 cl5 size-103 bg2 bor1 hov-btn1 p-lr-15 trans-04"
              >
                Get Products
              </Link>
            </div>
          </div>
        </section>
      </div>
      {/*  */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
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
                          {ProductDetail &&
                            ProductDetail.versions &&
                            ProductDetail.versions.length > 0 &&
                            ProductDetail.versions.map((version, index) => (
                              <button
                                key={index}
                                type="button"
                                data-bs-target="#productCarousel"
                                data-bs-slide-to={index}
                                className={index === 0 ? "active" : ""}
                                aria-label={`Slide ${index + 1}`}
                                style={style.wh}
                              >
                                <img
                                  src={version.images}
                                  className={
                                    index === 0
                                      ? "d-block w-100 h-full"
                                      : "d-block w-100"
                                  }
                                  alt=""
                                />
                              </button>
                            ))}
                        </div>
                      </div>

                      <div className="col-md-10 p-0">
                        {/* Large Image Carousel */}
                        <div className="carousel-inner" style={style.w500}>
                          {ProductDetail &&
                            ProductDetail.versions &&
                            ProductDetail.versions.length > 0 &&
                            ProductDetail.versions.map((version, index) => (
                              <div
                                className={`carousel-item ${
                                  index === 0 ? "active" : ""
                                }`}
                                key={index}
                              >
                                <img
                                  src={version.images}
                                  className="d-block w-100"
                                  alt={version.versionName}
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-5 p-b-30">
                  <div className="p-r-50 p-t-5 p-lr-0-lg">
                    <h4 className="mtext-105 cl2 js-name-detail p-b-14">
                      {ProductDetail ? ProductDetail.product.productName : ""}
                    </h4>

                    <span className="mtext-106 cl2">
                      {ProductDetail && ProductDetail.product
                        ? `${ProductDetail.product.price} VND`
                        : "Price not available"}
                    </span>

                    <p className="stext-102 cl3 p-t-23">
                      <span>
                        {ProductDetail && ProductDetail.versions
                          ? ProductDetail.versions.length
                          : 0}{" "}
                        ~ versions
                      </span>
                      {ProductDetail &&
                        ProductDetail.attributes &&
                        ProductDetail.attributes.length > 0 && (
                          <span>
                            {ProductDetail.attributes.map(
                              (attribute, index) => (
                                <span key={index} className="ms-3">
                                  {attribute.values.length} ~ {attribute.key}
                                </span>
                              )
                            )}
                          </span>
                        )}
                    </p>

                    {/* <!--  --> */}
                    <div className="p-t-33">
                      {ProductDetail &&
                        ProductDetail.attributes &&
                        ProductDetail.attributes.length > 0 &&
                        ProductDetail.attributes.map((attribute, index) => (
                          <div className="flex-w flex-r-m p-b-10" key={index}>
                            <div className="size-203 flex-c-m respon6">
                              {attribute.key}
                            </div>

                            <div className="size-204 respon6-next">
                              <div>
                                <select
                                  className="pt-3 pb-3 w-100 border border-1 p-2 rounded-0 form-select stext-111"
                                  aria-label="Default select example"
                                >
                                  {/* <option>Choose an option</option> */}
                                  {attribute.values.map((value, valueIndex) => (
                                    <option key={valueIndex} value={value}>
                                      {value}
                                    </option>
                                  ))}
                                </select>
                                <div className="dropDownSelect2"></div>
                              </div>
                            </div>
                          </div>
                        ))}

                      {/* <div className="flex-w flex-r-m p-b-10">
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
                      </div> */}

                      <div className="flex-w flex-r-m p-b-10 mt-3">
                        <div className="size-204 flex-w flex-m respon6-next">
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
                          className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 js-addwish-detail tooltip100"
                          data-tooltip="Add to Wishlist"
                        >
                          <i className="zmdi zmdi-favorite"></i>
                        </Link>
                      </div>

                      <Link
                        className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100"
                        data-tooltip="Facebook"
                      >
                        <i className="fa fa-facebook"></i>
                      </Link>

                      <Link
                        className="fs-14 cl3 hov-cl1 trans-04 lh-10 p-lr-5 p-tb-2 m-r-8 tooltip100"
                        data-tooltip="Twitter"
                      >
                        <i className="fa fa-twitter"></i>
                      </Link>

                      <Link
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

export default Home;

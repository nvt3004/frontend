import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import QuickViewProdDetail from "../../components/client/Modal/QuickViewProdDetail";
import productApi from "../../services/api/ProductApi";

const Product = () => {
  const [Categories, setCategories] = useState([]);
  const [Colors, setColors] = useState([]);
  const [Sizes, setSizes] = useState([]);
  const [Products, setProducts] = useState([]);
  //
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm của người dùng
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // Từ khóa sau khi debounce
  //
  const [categoryId, setCategoryId] = useState(null);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [color, setColor] = useState(null);
  const [size, setSize] = useState(null);
  const [sortPrice, setSortPrice] = useState("ASC");
  //
  const [ErrorCode, setErrorCode] = useState("204");
  const [ErrorMessage, setErrorMessage] = useState("No products found");
  //
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategorieAndColorAndSize = async () => {
      try {
        const response = await productApi.getAllCategory();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error.message);
      }
      try {
        const response = await productApi.getAllColor();
        setColors(response.data);
      } catch (error) {
        console.error("Error fetching colors:", error.message);
      }
      try {
        const response = await productApi.getAllSize();
        setSizes(response.data);
      } catch (error) {
        console.error("Error fetching sizes:", error.message);
      }
    };

    fetchCategorieAndColorAndSize();
  }, []);

  useEffect(() => {
    const fetchFilter = async () => {
      setLoading(true);
      if (!searchTerm) {
        try {
          const response = await productApi.filter(
            categoryId,
            minPrice,
            maxPrice,
            color,
            size,
            sortPrice
          );
          if (response.data || !response.data == null) {
            setProducts(response.data);
          } else {
            setProducts([]);
          }
        } catch (error) {
          console.error("Error fetching filter:", error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setProducts([]);
      }
    };

    fetchFilter();
  }, [minPrice, maxPrice, size, color, sortPrice, searchTerm, categoryId]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  const handleSearch = async (keywork) => {
    setLoading(true);
    try {
      const response = await productApi.searchProduct(keywork);
      if (response && response.data) {
        setProducts(response.data);
      } else {
        setProducts([]);
        setErrorCode(response.code);
        setErrorMessage(response.message);
      }
    } catch (error) {
      console.log("Handle search error:" + error);
    } finally {
      setLoading(false);
    }
  };
  const handleChangeCategory = async (id) => {
    setCategoryId(id);
    setSearchTerm("");
  };
  const style = {
    m: { marginTop: "40px" },
  };
  return (
    <div style={style.m}>
      {/* <!-- Product --> */}
      <section id="productTop" className="bg0 p-t-23 p-b-64">
        <div className="container">
          <div className="flex-w flex-sb-m p-b-52">
            <div className="flex-w flex-l-m filter-tope-group m-tb-10">
              <button
                className="stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5 how-active1"
                onClick={() => handleChangeCategory(-1)}
              >
                All Products
              </button>
              {Categories.map((category) => (
                <button
                  key={category.categoryId}
                  className="stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5 how-active1"
                  onClick={() => handleChangeCategory(category.categoryId)}
                >
                  {category.categoryName}
                </button>
              ))}
            </div>

            <div className="flex-w flex-c-m m-tb-10">
              <div>
                <button
                  className=" flex-c-m stext-106 cl6 size-104 bor4 pointer hov-btn3 trans-04 m-r-8 m-tb-4"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseOne"
                  aria-expanded="false"
                  aria-controls="flush-collapseOne"
                >
                  <i className="icon-filter cl2 m-r-6 fs-15 trans-04 zmdi zmdi-filter-list"></i>
                  {/* <i className="icon-close-filter cl2 m-r-6 fs-15 trans-04 zmdi zmdi-close dis-none"></i> */}
                  Filter
                </button>
              </div>

              <div>
                <button
                  className="flex-c-m stext-106 cl6 size-105 bor4 pointer hov-btn3 trans-04 m-tb-4 js-show-search"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseTwo"
                  aria-expanded="false"
                  aria-controls="flush-collapseTwo"
                >
                  <i className="icon-search cl2 m-r-6 fs-15 trans-04 zmdi zmdi-search"></i>
                  {/* <i className="icon-close-search cl2 m-r-6 fs-15 trans-04 zmdi zmdi-close dis-none"></i> */}
                  Search
                </button>
              </div>
            </div>

            {/* accordion của search và filter */}
            <div
              className="accordion accordion-flush w-100"
              id="accordionFlushExample"
            >
              <div className="accordion-item border border-0">
                <div
                  id="flush-collapseOne"
                  className="accordion-collapse collapse"
                  data-bs-parent="#accordionFlushExample"
                >
                  <div className="accordion-body p-0">
                    {/* <!-- Filter --> */}
                    <div className="panel-filter w-full p-t-10">
                      <div className="wrap-filter flex-w bg6 w-full p-lr-40 p-t-27 p-lr-15-sm">
                        <div className="filter-col2 p-r-15 p-b-27">
                          <div className="mtext-102 cl2 p-b-15">Price</div>

                          <ul className="list-unstyled">
                            <li className="p-b-6">
                              <span
                                className="text-decoration-none filter-link stext-106 trans-04 filter-link-active"
                                onClick={() => {
                                  setMinPrice(null);
                                  setMaxPrice(null);
                                }}
                              >
                                All
                              </span>
                            </li>

                            <li className="p-b-6">
                              <span
                                className="text-decoration-none filter-link stext-106 trans-04"
                                onClick={() => {
                                  setMinPrice(0);
                                  setMaxPrice(200000);
                                }}
                              >
                                0.000 VND - 200.000 VND
                              </span>
                            </li>

                            <li className="p-b-6">
                              <span
                                className="text-decoration-none filter-link stext-106 trans-04"
                                onClick={() => {
                                  setMinPrice(200000);
                                  setMaxPrice(400000);
                                }}
                              >
                                200.000 VND - 400.000 VND
                              </span>
                            </li>

                            <li className="p-b-6">
                              <span
                                className="text-decoration-none filter-link stext-106 trans-04"
                                onClick={() => {
                                  setMinPrice(400000);
                                  setMaxPrice(600000);
                                }}
                              >
                                400.000 VND - 600.000 VND
                              </span>
                            </li>

                            <li className="p-b-6">
                              <span
                                className="text-decoration-none filter-link stext-106 trans-04"
                                onClick={() => {
                                  setMinPrice(600000);
                                  setMaxPrice(800000);
                                }}
                              >
                                600.000 VND - 800.000 VND
                              </span>
                            </li>

                            <li className="p-b-6">
                              <span
                                className="text-decoration-none filter-link stext-106 trans-04"
                                onClick={() => {
                                  setMinPrice(1000000);
                                  setMaxPrice(null);
                                }}
                              >
                                1.000.000 VNĐ +
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div className="filter-col3 p-r-15 p-b-27">
                          <div className="mtext-102 cl2 p-b-15">Color</div>

                          <ul className="list-unstyled">
                            <li className="p-b-6">
                              <span
                                className="fs-15 lh-12 m-r-6"
                                style={{ color: "#222" }}
                              >
                                <i className="zmdi zmdi-circle"></i>
                              </span>

                              <span
                                onClick={() => {
                                  setColor(null);
                                }}
                                className="filter-link-active text-decoration-none filter-link stext-106 trans-04"
                              >
                                All
                              </span>
                            </li>
                            {Colors.map((color) => (
                              <li key={color.id} className="p-b-6">
                                <span
                                  className="fs-15 lh-12 m-r-6"
                                  style={{ color: "#222" }}
                                >
                                  <i className="zmdi zmdi-circle"></i>
                                </span>

                                <span
                                  className="text-decoration-none filter-link stext-106 trans-04"
                                  onClick={() => {
                                    setColor(color.id);
                                  }}
                                >
                                  {color.attributeValue}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="filter-col4 p-b-27 pe-5">
                          <div className="mtext-102 cl2 p-b-15">Sizes</div>

                          <div className="flex-w p-t-4 m-r--5">
                            <span
                              className=" text-decoration-none flex-c-m stext-107 cl6 size-301 bor7 p-lr-15 hov-tag1 trans-04 m-r-5 m-b-5 rounded-0"
                              onClick={() => {
                                setSize(null);
                              }}
                            >
                              All
                            </span>
                            {Sizes.map((size) => (
                              <span
                                key={size.id}
                                className="text-decoration-none flex-c-m stext-107 cl6 size-301 bor7 p-lr-15 hov-tag1 trans-04 m-r-5 m-b-5 rounded-0"
                                onClick={() => {
                                  setSize(size.id);
                                }}
                              >
                                {size.attributeValue}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="filter-col1 p-r-15 p-b-27">
                          <div className="mtext-102 cl2 p-b-15">Sort By</div>

                          <ul className="list-unstyled">
                            <li className="p-b-6">
                              <span
                                className="text-decoration-none filter-link stext-106 trans-04"
                                onClick={() => {
                                  setSortPrice("ASC");
                                }}
                              >
                                Price: Low to High
                              </span>
                            </li>

                            <li className="p-b-6">
                              <span
                                className="text-decoration-none filter-link stext-106 trans-04"
                                onClick={() => {
                                  setSortPrice("DESC");
                                }}
                              >
                                Price: High to Low
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <div
                  id="flush-collapseTwo"
                  className="accordion-collapse collapse"
                  data-bs-parent="#accordionFlushExample"
                >
                  <div className="accordion-body p-0">
                    {/* <!-- Search product --> */}
                    <div className="panel-search w-full p-t-10 p-b-15">
                      <div className="bor8 dis-flex p-l-15">
                        <button
                          className="size-113 flex-c-m fs-16 cl2 hov-cl1 trans-04"
                          onClick={() => handleSearch(searchTerm)}
                        >
                          <i className="zmdi zmdi-search"></i>
                        </button>

                        <input
                          className="mtext-107 cl2 size-114 plh2 p-r-15"
                          type="search"
                          name="search-product"
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row isotope-grid">
            {!Products || Products.length ? (
              Products.map((product) => (
                <div
                  key={product.objectID}
                  className="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item women"
                >
                  <div className="block2">
                    <div className="block2-pic hov-img0">
                      <img src={product.img} alt="IMG-PRODUCT" />
                      {/* Quick View */}
                      <QuickViewProdDetail />
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
                          {`${product.minPrice}VND ~ ${product.maxPrice}VND`}
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
              <div>
                {loading ? (
                  <div class="d-flex justify-content-center mt-5 mb-5">
                    <div class="spinner-border" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>
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
            )}
          </div>
          {/* <!-- Load more --> */}
          <div className="flex-c-m flex-w w-full ">
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
  );
};

export default Product;

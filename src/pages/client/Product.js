import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import productApi from "../../services/api/ProductApi";
import SpeechToText from "../../components/client/search/SpeechtoText";
import Wish from "../../components/client/ProdWish/Wish";

const Product = () => {
  const dispatch = useDispatch();

  // Danh sách sản phẩm
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("No products found");

  // Trạng thái phân trang
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);

  // Bộ lọc sản phẩm
  const [filterAttributes, setFilterAttributes] = useState({
    color: [],
    size: [],
    category: [],
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMinPrice, setSelectedMinPrice] = useState(null);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sortOrder, setSortOrder] = useState("ASC");
  const [action, setAction] = useState(0);

  // Fetch bộ lọc một lần khi component mount
  useEffect(() => {
    const fetchFilterAttributes = async () => {
      try {
        const response = await productApi.getFilterAttribute();
        setFilterAttributes(response.data.data);
      } catch (error) {
        console.error("Error fetching filter attributes:", error.message);
      }
    };

    fetchFilterAttributes();
  }, []);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setAction(1);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch sản phẩm khi debounce search term thay đổi
  useEffect(() => {
    if (debouncedSearchTerm !== "") {
      resetProducts();
      fetchProducts();
    }
  }, [debouncedSearchTerm]);

  // Fetch sản phẩm khi bộ lọc thay đổi
  useEffect(() => {
    resetProducts();
    fetchProducts();
  }, [
    selectedCategory,
    selectedMinPrice,
    selectedMaxPrice,
    selectedColor,
    selectedSize,
    sortOrder,
  ]);

  const resetProducts = () => {
    setProducts([]);
    setCurrentPage(0);
    setErrorMessage("No products found");
    setHasMoreProducts(true);
  };

  const fetchProducts = async () => {
    setLoading(true);
    const pageSize = 2; // Số sản phẩm mỗi lần
    try {
      const response = await productApi.getProds({
        query: debouncedSearchTerm,
        categoryName: selectedCategory,
        minPrice: selectedMinPrice,
        maxPrice: selectedMaxPrice,
        color: selectedColor,
        size: selectedSize,
        sortPrice: sortOrder,
        page: currentPage,
        pageSize: pageSize,
        action: action,
      });

      // console.log("Fetching products with parameters:", {
      //   query: debouncedSearchTerm,
      //   categoryName: selectedCategory,
      //   minPrice: selectedMinPrice,
      //   maxPrice: selectedMaxPrice,
      //   color: selectedColor,
      //   size: selectedSize,
      //   sortPrice: sortOrder,
      //   page: currentPage,
      //   pageSize: pageSize,
      //   action: action,
      // });

      let newProducts = response?.data || [];

      if (newProducts.length > 0) {
        setProducts((prevProducts) => [...prevProducts, ...newProducts]);
        setHasMoreProducts(newProducts.length === pageSize);
        setErrorMessage(""); // Reset error message on successful fetch
      } else {
        setHasMoreProducts(false);
        if (currentPage === 0) {
          setErrorMessage("No products found");
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error.message);
      setErrorMessage("Error fetching products.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (attribute, value) => {
    switch (attribute) {
      case "category":
        setSelectedCategory(value);
        break;
      case "color":
        setSelectedColor(value);
        break;
      case "size":
        setSelectedSize(value);
        break;
      case "minPrice":
        setSelectedMinPrice(value);
        break;
      case "maxPrice":
        setSelectedMaxPrice(value);
        break;
      case "sortOrder":
        setSortOrder(value);
        break;
      default:
        break;
    }
    setAction(0);
  };

  const handleClearFilter = () => {
    resetProducts();
    setSelectedCategory(null);
    setSelectedMinPrice(null);
    setSelectedMaxPrice(null);
    setSelectedColor(null);
    setSelectedSize(null);
    setSortOrder("ASC");
    setAction(0);
  };

  // Load thêm sản phẩm khi currentPage thay đổi
  useEffect(() => {
    if (currentPage > 0) {
      fetchProducts();
    }
  }, [currentPage]);

  const handleLoadMore = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleSpeechText = (text) => {
    setSearchTerm(text);
  };

  const handleAddWishlist = async (id) => {
    try {
      await productApi.addWishlist(id, dispatch);
      setProducts((prevProducts) =>
        prevProducts.map((prod) =>
          prod.id === id ? { ...prod, like: true } : prod
        )
      );
    } catch (error) {
      console.error("Error adding to Wishlist:", error.message);
    }
  };

  const handleRemoveWishlist = async (id) => {
    try {
      await productApi.removeWishlist(id, dispatch);
      setProducts((prevProducts) =>
        prevProducts.map((prod) =>
          prod.id === id ? { ...prod, like: false } : prod
        )
      );
    } catch (error) {
      console.error("Error removing from Wishlist:", error.message);
    }
  };

  const style = {
    m: { marginTop: "40px" },
    h: { height: "60vh" },
  };

  return (
    <div style={style.m}>
      {/* <!-- Product --> */}
      <section id="productTop" className="bg0 p-t-23 p-b-64">
        <div className="container">
          <div className="flex-w flex-sb-m p-b-52">
            {/* Bộ lọc Category */}
            <div className="flex-w flex-l-m filter-tope-group m-tb-10">
              <button
                className={`stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5 ${
                  selectedCategory === null || selectedCategory === ""
                    ? "how-active1"
                    : ""
                }`}
                onClick={() => handleSelectChange("category", "")}
              >
                All Products
              </button>
              {filterAttributes.category &&
                filterAttributes.category.length > 0 &&
                filterAttributes.category.map((category) => (
                  <button
                    key={category.categoryId}
                    className={`stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5  ${
                      selectedCategory === category.categoryName
                        ? "how-active1"
                        : ""
                    }`}
                    onClick={() =>
                      handleSelectChange("category", category.categoryName)
                    }
                  >
                    {category.categoryName}
                  </button>
                ))}
            </div>

            {/* Nút mở bộ lọc và tìm kiếm */}
            <div className="flex-w flex-c-m m-tb-10">
              <div>
                <button
                  className="flex-c-m stext-106 cl6 size-104 bor4 pointer hov-btn3 trans-04 m-r-8 m-tb-4"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseOne"
                  aria-expanded="false"
                  aria-controls="flush-collapseOne"
                >
                  <i className="icon-filter cl2 m-r-6 fs-15 trans-04 zmdi zmdi-filter-list"></i>
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
                  Search
                </button>
              </div>
            </div>

            {/* Accordion của Search và Filter */}
            <div
              className="accordion accordion-flush w-100 "
              id="accordionFlushExample"
            >
              {/* Accordion Filter */}
              <div className="accordion-item border border-0 ">
                <div
                  id="flush-collapseOne"
                  className="accordion-collapse collapse"
                  data-bs-parent="#accordionFlushExample"
                >
                  <div className="accordion-body p-0">
                    {/* <!-- Filter --> */}
                    <div className="panel-filter w-full mb-3">
                      <div className="wrap-filter flex-w bg6 w-full p-lr-40 p-t-27 p-lr-15-sm">
                        {/* Price Filter */}
                        <div className="filter-col2 p-r-15 p-b-27">
                          <div className="mtext-102 cl2 p-b-15">Price</div>

                          <ul className="list-unstyled">
                            <li className="p-b-6">
                              <span
                                className={`text-decoration-none filter-link stext-106 trans-04 pointer ${
                                  selectedMinPrice === null &&
                                  selectedMaxPrice === null
                                    ? "filter-link-active"
                                    : ""
                                }`}
                                onClick={() => {
                                  handleSelectChange("minPrice", null);
                                  handleSelectChange("maxPrice", null);
                                }}
                              >
                                All
                              </span>
                            </li>

                            <li className="p-b-6">
                              <span
                                className={`text-decoration-none filter-link stext-106 trans-04 pointer ${
                                  selectedMinPrice === 0 &&
                                  selectedMaxPrice === 200000
                                    ? "filter-link-active"
                                    : ""
                                }`}
                                onClick={() => {
                                  handleSelectChange("minPrice", 0);
                                  handleSelectChange("maxPrice", 200000);
                                }}
                              >
                                0.000 VND - 200.000 VND
                              </span>
                            </li>

                            <li className="p-b-6">
                              <span
                                className={`text-decoration-none filter-link stext-106 trans-04 pointer ${
                                  selectedMinPrice === 200000 &&
                                  selectedMaxPrice === 400000
                                    ? "filter-link-active"
                                    : ""
                                }`}
                                onClick={() => {
                                  handleSelectChange("minPrice", 200000);
                                  handleSelectChange("maxPrice", 400000);
                                }}
                              >
                                200.000 VND - 400.000 VND
                              </span>
                            </li>

                            <li className="p-b-6">
                              <span
                                className={`text-decoration-none filter-link stext-106 trans-04 pointer ${
                                  selectedMinPrice === 400000 &&
                                  selectedMaxPrice === 600000
                                    ? "filter-link-active"
                                    : ""
                                }`}
                                onClick={() => {
                                  handleSelectChange("minPrice", 400000);
                                  handleSelectChange("maxPrice", 600000);
                                }}
                              >
                                400.000 VND - 600.000 VND
                              </span>
                            </li>

                            <li className="p-b-6">
                              <span
                                className={`text-decoration-none filter-link stext-106 trans-04 pointer ${
                                  selectedMinPrice === 600000 &&
                                  selectedMaxPrice === 800000
                                    ? "filter-link-active"
                                    : ""
                                }`}
                                onClick={() => {
                                  handleSelectChange("minPrice", 600000);
                                  handleSelectChange("maxPrice", 800000);
                                }}
                              >
                                600.000 VND - 800.000 VND
                              </span>
                            </li>

                            <li className="p-b-6">
                              <span
                                className={`text-decoration-none filter-link stext-106 trans-04 pointer ${
                                  selectedMinPrice === 1000000 &&
                                  selectedMaxPrice === null
                                    ? "filter-link-active"
                                    : ""
                                }`}
                                onClick={() => {
                                  handleSelectChange("minPrice", 1000000);
                                  handleSelectChange("maxPrice", null);
                                }}
                              >
                                1.000.000 VND +
                              </span>
                            </li>
                          </ul>
                        </div>

                        {/* Color Filter */}
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
                                  handleSelectChange("color", null);
                                }}
                                className={`text-decoration-none filter-link stext-106 trans-04 pointer ${
                                  selectedColor === null
                                    ? "filter-link-active"
                                    : ""
                                }`}
                              >
                                All
                              </span>
                            </li>
                            {filterAttributes.color &&
                              filterAttributes.color.length > 0 &&
                              filterAttributes.color.map((colorItem, index) => (
                                <li
                                  key={colorItem.id ? colorItem.id : index}
                                  className="p-b-6"
                                >
                                  <span
                                    className="fs-15 lh-12 m-r-6"
                                    style={{ color: "#222" }}
                                  >
                                    <i className="zmdi zmdi-circle"></i>
                                  </span>

                                  <span
                                    className={`text-decoration-none filter-link stext-106 trans-04 pointer ${
                                      selectedColor === colorItem.attributeValue
                                        ? "filter-link-active"
                                        : ""
                                    }`}
                                    onClick={() => {
                                      handleSelectChange(
                                        "color",
                                        colorItem.attributeValue
                                      );
                                    }}
                                  >
                                    {colorItem.attributeValue}
                                  </span>
                                </li>
                              ))}
                          </ul>
                        </div>

                        {/* Sizes Filter */}
                        <div className="filter-col4 p-b-27 pe-5">
                          <div className="mtext-102 cl2 p-b-15">Sizes</div>

                          <ul className="list-unstyled">
                            <li className="p-b-6">
                              <span
                                onClick={() => {
                                  handleSelectChange("size", null);
                                }}
                                className={`text-decoration-none filter-link stext-106 trans-04 pointer ${
                                  selectedSize === null
                                    ? "filter-link-active"
                                    : ""
                                }`}
                              >
                                All
                              </span>
                            </li>
                            {filterAttributes.size &&
                              filterAttributes.size.length > 0 &&
                              filterAttributes.size.map((sizeItem, index) => (
                                <li
                                  key={sizeItem.id ? sizeItem.id : index}
                                  className="p-b-6"
                                >
                                  <span
                                    className={`text-decoration-none filter-link stext-106 trans-04 pointer ${
                                      selectedSize === sizeItem.attributeValue
                                        ? "filter-link-active"
                                        : ""
                                    }`}
                                    onClick={() => {
                                      handleSelectChange(
                                        "size",
                                        sizeItem.attributeValue
                                      );
                                    }}
                                  >
                                    {sizeItem.attributeValue}
                                  </span>
                                </li>
                              ))}
                          </ul>
                        </div>
                        {/* Sort By */}
                        <div className="filter-col1 p-r-15 p-b-27">
                          <div className="mtext-102 cl2 p-b-15">Sort By</div>

                          <ul className="list-unstyled">
                            <li className="p-b-6">
                              <span
                                className={`text-decoration-none filter-link stext-106 trans-04 pointer ${
                                  sortOrder === "ASC"
                                    ? "filter-link-active"
                                    : ""
                                }`}
                                onClick={() => {
                                  handleSelectChange("sortOrder", "ASC");
                                }}
                              >
                                Price: Low to High
                              </span>
                            </li>

                            <li className="p-b-6">
                              <span
                                className={`text-decoration-none filter-link stext-106 trans-04 pointer ${
                                  sortOrder === "DESC"
                                    ? "filter-link-active"
                                    : ""
                                }`}
                                onClick={() => {
                                  handleSelectChange("sortOrder", "DESC");
                                }}
                              >
                                Price: High to Low
                              </span>
                            </li>
                          </ul>
                        </div>
                        {/* Nút Bỏ Chọn Bộ Lọc */}
                        <div className="clear-filters p-t-10 p-b-15 ms-auto">
                          <button
                            onClick={handleClearFilter}
                            className="flex-c-m stext-106 cl6 size-105 bor4 pointer hov-btn3 trans-04 m-tb-4 ps-3 pe-3"
                          >
                            Clear All Filters
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Accordion Search */}
                <div className="accordion-item border-0">
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
                            onClick={(e) => {
                              e.preventDefault();
                              // Nút này không cần thực hiện hành động nào vì tìm kiếm được xử lý bởi debounce
                            }}
                          >
                            <i className="zmdi zmdi-search"></i>
                          </button>

                          <input
                            className="mtext-107 cl2 size-114 plh2 p-r-15"
                            type="search"
                            name="search-product"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search"
                          />
                          <SpeechToText speechText={handleSpeechText} />
                          <button className="size-113 flex-c-m fs-23 cl2 hov-cl1 trans-04 me-2">
                            <i class="zmdi zmdi-wallpaper"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="row isotope-grid ">
                {products && products.length > 0 ? (
                  products.map((product, index) => (
                    <div
                      key={index} // Đảm bảo rằng mỗi sản phẩm có một key duy nhất
                      className="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item women"
                    >
                      <div className="block2">
                        <div className="block2-pic hov-img0">
                          <img src={product.imgName} alt="IMG-PRODUCT" />
                          {/* Quick View */}
                          <button
                            type="button"
                            className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 text-decoration-none"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
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
                              {`${product.minPrice} VND ~ ${product.maxPrice} VND`}
                            </span>
                          </div>

                          <div className="block2-txt-child2 flex-r p-t-3">
                            <Wish
                              prodID={product.id}
                              isWish={product.like}
                              handleAddWish={() => {
                                handleAddWishlist(product.id);
                              }}
                              handleRemoveWish={() =>
                                handleRemoveWishlist(product.id)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={style.h}>
                    {loading ? (
                      <div className="d-flex align-content-center justify-content-center mt-5 mb-5">
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <div className="d-flex align-content-center justify-content-center mt-5 mb-5">
                        <div className="pt-5 pb-5 opacity-50">
                          <p className="fs-4 text-muted mt-3">{errorMessage}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* <!-- Load more --> */}
              <div className="flex-c-m flex-w w-full ">
                {hasMoreProducts ? (
                  <div className="d-flex justify-content-center mt-4">
                    <button
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="text-decoration-none flex-c-m stext-101 cl5 size-103 bg2 bor1 hov-btn1 p-lr-15 trans-04"
                    >
                      {loading ? "Loading..." : "Load More"}
                    </button>
                  </div>
                ) : (
                  <button className="text-decoration-none flex-c-m stext-101 cl5 size-103 bg2 bor1 hov-btn1 p-lr-15 trans-04">
                    No more products to load
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*  */}
    </div>
  );
};

export default Product;

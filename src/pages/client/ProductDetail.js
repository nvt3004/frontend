import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";
import "../../assets/style/custom-scroll.css";
import QuickViewProdDetail from "../../components/client/Modal/QuickViewProdDetail";
import moment from "moment";
import { stfExecAPI, ghnExecAPI } from "../../stf/common";
import ava from "../../assets/images/avatar-01.jpg";
import productApi from "../../services/api/ProductApi";
import AddCartItem from "../../components/client/AddCartItem/AddCartItem";
import DangerAlert from "../../components/client/sweetalert/DangerAlert";
import SuccessAlert from "../../components/client/sweetalert/SuccessAlert";

import { useDispatch } from "react-redux";

import { incrementCart } from "../../store/actions/cartActions";
import Wish from "../../components/client/ProdWish/Wish";
import heart1 from "../../assets/images/icons/icon-heart-01.png";
import heart2 from "../../assets/images/icons/icon-heart-02.png";
import prod12 from "../../assets/images/product-01.jpg";
import SizeGuide from "../../components/client/Modal/SizeGuideModal";
import logo from "../../assets/images/icons/logo.png"
function getRowCelCick(attributes = [], item) {
  for (let i = 0; i < attributes.length; i++) {
    const key = attributes[i].key;

    for (let j = 0; j < attributes[i].values.length; j++) {
      const val = attributes[i].values[j];

      if (key?.toLowerCase() == item?.key?.toLowerCase()) {
        if (val?.toLowerCase() == item?.value?.toLowerCase()) {
          console.log("Vô for");
          return [i, j];
        }
      }
    }

    return [0, 0];
  }
}

const ProductDetail = () => {
  const dispatch = useDispatch();
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  const toggleOffcanvas = () => {
    setIsOffcanvasOpen((prev) => !prev);
  };

  const [Products, setProducts] = useState([]);
  const [ErrorMessage] = useState("No products found");
  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const response = await productApi.getRecommendedProducts();
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    fetchRecommendedProducts();
  }, []);

  const handleAddWishlist = async (id) => {
    try {
      await productApi.addWishlist(id, dispatch);
      setProducts((prevProducts) =>
        prevProducts.map((prod) =>
          prod.id === id
            ? { ...prod, like: true } // Đánh dấu sản phẩm là 'liked'
            : prod
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
          prod.id === id
            ? { ...prod, like: false } // Gỡ dấu 'liked' khỏi sản phẩm
            : prod
        )
      );
    } catch (error) {
      console.error("Error removing from Wishlist:", error.message);
    }
  };

  //Minh ty làm *************************************
  const [product, setProduct] = useState([]);
  const [ProductDetail, setProductDetail] = useState();
  const [attriTest, setAttriTest] = useState([]);
  const [pd, setPd] = useState();
  const [err, setErr] = useState();
  const [price, setPrice] = useState(0);

  const [verName, setVername] = useState();

  const [verId, setVerId] = useState(null);

  const [rating, setRating] = useState(0); // Trạng thái lưu số sao được chọn
  // Lấy param từ URL (nếu có)
  const { id: paramId } = useParams();
  // Lấy query param từ URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryId = queryParams.get("id");
  // Ưu tiên param ID, nếu không có thì lấy query param
  const [productId, setProductId] = useState(null);

  const [feedBack, setFeedBack] = useState(null);
  const [feedBackPage, setFeedBackPage] = useState(1);
  const [error, setError] = useState(null); // Để lưu lỗi nếu có

  // Hàm để chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= feedBack?.totalPage) {
      setFeedBackPage(newPage);
    }
  };
  useEffect(() => {
    const fetching = async () => {
      const id = paramId || queryId;
      if (id) {
        try {
          const response = await productApi.getFeedback({
            idProduct: id,
            page: feedBackPage,
            pageSize: 10,
          });
          if (response && response.data) {
            console.log("Feedback data:", response.data);
            setFeedBack(response.data);
          } else {
            console.log("No data found in response");
          }
        } catch (error) {
          setError(error.message);
          console.error("Error fetching feedback:", error.message);
        }
      }
    };
    fetching();
  }, [feedBackPage, paramId, queryId]);

  useEffect(() => {
    const fetchProductDetail = async () => {
      const id = paramId || queryId;
      if (id) {
        setProductId(id); // Đặt productId theo `paramId` hoặc `queryId`

        try {
          const response = await productApi.getProductDetail(id);
          setProductDetail(response.data.data); // Lưu chi tiết sản phẩm vào state

          const product = await findProductDetailById(id);
          console.log("Ty", product);
          getProductDetail(id);

          setPd(product);
          setProduct(
            partitionProduct(
              product,
              product?.attributes,
              getRowCelCick(
                product?.versions?.attributes,
                product?.attributes[0]
              ),
              product?.attributes[0]?.key
            )
          );
          setAttriTest(product?.attributes);
          setVername();
          setVerId(null);
        } catch (error) {
          console.error("Error fetching product:", error.message);
        }
      }
    };

    fetchProductDetail();
  }, [paramId, queryId]);

  //Xử lý thay đổi phiên bản sản phẩm trong giỏ hàng
  const findAllValueInAttributes = useCallback(
    (atbs, products, keyToEetrieve) => {
      const atbsTemp = [...atbs];

      if (atbsTemp.length >= 2) {
        atbsTemp.splice(-1, 1);
      }

      const versionTemps = { ...products }.versions.filter((item, index) => {
        const atbVersionTemps = item.attributes.filter((a) => {
          return (
            atbsTemp.find(
              (o) =>
                o?.key?.toLowerCase() == a?.key?.toLowerCase() &&
                o?.value?.toLowerCase() == a?.value?.toLowerCase()
            ) !== undefined
          );
        });

        return atbVersionTemps.length === atbsTemp.length;
      });

      const values = versionTemps.map((vs) => {
        const ob = vs.attributes.find((a) => {
          return a?.key?.toLowerCase() == keyToEetrieve?.toLowerCase();
        });
        return ob ? ob?.value?.toLowerCase() : "";
      });

      return [...new Set(values.filter((i) => i !== ""))];
    },
    []
  );

  const partitionProduct = useCallback(
    (
      products,
      atbSelected,
      rowCelClick = [0, 0],
      keySelectedWhenClick = "size"
    ) => {
      const arrs = [...products.attributes].map((a) => {
        return a.values;
      });
      const [row, cel] = rowCelClick;
      const valueReduces = [
        { key: keySelectedWhenClick, value: arrs[row][cel] },
      ];
      let atbProducts = JSON.parse(JSON.stringify(products.attributes));

      let t = { ...atbProducts[row] };
      atbProducts[row] = atbProducts[0];
      atbProducts[0] = t;

      let results = [];

      atbProducts.forEach((item, index) => {
        const key = item.key;
        const values = item.values;

        const ob = {
          key: key,
          values: [],
        };

        const valueByVersion = findAllValueInAttributes(
          valueReduces,
          products,
          key
        );

        values.forEach((vl) => {
          let active = false;
          let disible = false;

          if (
            key?.toLowerCase() == keySelectedWhenClick?.toLowerCase() &&
            arrs[row][cel]?.toLowerCase() == vl?.toLowerCase()
          ) {
            active = true;
          } else if (
            key?.toLowerCase() !== keySelectedWhenClick?.toLowerCase()
          ) {
            const isInner = valueByVersion.includes(vl?.toLowerCase());
            const valueActive = [...atbSelected].find(
              (o) => o.key == key && o.value == vl
            );
            disible = !isInner;
            active = valueActive !== undefined && isInner ? true : false;
          }

          if (active === true && index > 0) {
            valueReduces.push({ key, value: vl });
          }

          ob.values.push({ val: vl, active, disible });
        });

        results.push(ob);
      });

      let rs = { ...results[row] };
      results[row] = results[0];
      results[0] = rs;
      return results;
    },
    []
  );

  const handleClickItemAttribute = ({ key, value, rowCel, pdu }) => {
    const [row, cel] = rowCel;
    const tem = attriTest.map((o) => {
      const isEqual = o?.key?.toLowerCase() == key?.toLowerCase();
      return isEqual ? { ...o, value: value } : o;
    });

    setAttriTest(tem);
    setProduct(partitionProduct(pd, tem, [row, cel], key));

    console.log("test ", partitionProduct(pd, tem, [row, cel], key));

    setPriceWhenChangeVersion(partitionProduct(pd, tem, [row, cel], key));
  };

  const setPriceWhenChangeVersion = (product) => {
    const length = product.length;
    let numberReduce = 0;
    const versionCompare = [];

    product.forEach((p) => {
      p.values.forEach((vl) => {
        if (vl.active && !vl.disible) {
          numberReduce += 1;
          versionCompare.push({ key: p.key, value: vl.val });
        }
      });
    });

    console.log("Versioncompate: ", versionCompare);

    if (length == numberReduce) {
      for (let vs of ProductDetail.versions) {
        let checkCount = vs.attributes.length;
        let temp = 0;

        for (let att of vs.attributes) {
          if (
            versionCompare.find(
              (i) =>
                i.key.toLowerCase() == att.key.toLowerCase() &&
                i.value.toLowerCase() == att.value.toLowerCase()
            )
          ) {
            temp += 1;
          }
        }

        if (checkCount == temp) {
          setPrice(vs.price);
          setVername(vs.versionName);
          setVerId(vs.id);
          break;
        }
      }
    }
  };

  const handleClickSaveUpdateVersion = async (product) => {
    const length = product.length;
    let numberReduce = 0;
    const versionCompare = [];

    product.forEach((p) => {
      p.values.forEach((vl) => {
        if (vl.active && !vl.disible) {
          numberReduce += 1;
          versionCompare.push({ key: p.key, value: vl.val });
        }
      });
    });

    console.log("Versioncompate: ", versionCompare);

    if (length == numberReduce) {
      setErr("");

      for (let vs of ProductDetail.versions) {
        let checkCount = vs.attributes.length;
        let temp = 0;

        for (let att of vs.attributes) {
          if (
            versionCompare.find(
              (i) =>
                i.key.toLowerCase() == att.key.toLowerCase() &&
                i.value.toLowerCase() == att.value.toLowerCase()
            )
          ) {
            temp += 1;
          }
        }

        if (checkCount == temp) {
          //Thêm vào giỏ hàng
          await handleAddVersionToCart({ versionId: vs.id, quantity: 1 });
          break;
        }
      }
    } else {
      setErr("Please select full attributes!");
    }
  };

  //Thêm sản phẩm vào giỏ hàng
  const handleAddVersionToCart = async ({ versionId, quantity }) => {
    const [error, data] = await stfExecAPI({
      method: "post",
      url: "api/user/cart/add",
      data: {
        versionId: versionId,
        quantity: quantity,
      },
    });

    if (error) {
      // DangerAlert({
      //   text:
      //     `${error?.response?.data?.code}: ${error?.response?.data?.message}` ||
      //     "Server error",
      // });
      window.location.href = "/auth/login";
      return;
    } else {
      dispatch(incrementCart());
    }

    SuccessAlert({
      text: "Add product to cart success!",
    });
  };

  const getProductDetail = async (id) => {
    try {
      const response = await productApi.getProductDetail(id);
      setProductDetail(response.data.data);
    } catch (error) {
      console.error("Error fetching product:", error.message);
    }
  };
  const findProductDetailById = async (id) => {
    try {
      const response = await productApi.getProductDetail(id);

      return response.data.data;
    } catch (error) {
      console.error("Error fetching product:", error.message);
    }
  };

  // Kiểm tra nếu không có id từ cả hai nguồn
  if (!productId) {
    return (
      <div
        className="d-flex align-items-center justify-content-center fs-4 text-muted mt-3"
        style={{ height: "80vh" }}
      >
        Product ID not found
      </div>
    );
  }

  const formatCurrencyVND = (amount) => {
    if (amount == null) return "";
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const handleRating = (index) => {
    setRating(index); // Cập nhật trạng thái khi người dùng chọn sao
  };
  const findIndexByKeyValue = (attributes, key, value) => {
    const attribute = attributes.find((attr) => attr.key === key);
    return attribute && attribute.values ? attribute.values.indexOf(value) : -1;
  };
  const style = {
    m: { marginTop: "80px" },
    w500: { width: "100%" },
    wh: { width: "100px", height: "126px" },
  };
  return (
    <div className="container" style={style.m}>
      {/* <!-- Product Detail --> */}
      <SizeGuide isOpen={isOffcanvasOpen} onClose={toggleOffcanvas} />
      <section className="sec-product-detail bg0 p-t-65 p-b-60">
        <div>
          <div className="row">
            <div className="col-md-6 col-lg-7 p-b-30">
              <div
                id="productCarousel"
                className="carousel slide carousel-fade"
              >
                <div className="row m-0">
                  <div className="col-md-2">
                    {/* Thumbnail Images as Indicators */}
                    <div className="carousel-indicators flex-column h-100 m-0 overflow-auto custom-scrollbar">
                      {ProductDetail?.versions?.length > 0 &&
                        ProductDetail.versions.map((version, index) => (
                          <button
                            key={version.id}
                            type="button"
                            data-bs-target="#productCarousel"
                            data-bs-slide-to={index}
                            className={`${
                              (index === 0 && !verId) || verId === version.id
                                ? "active"
                                : ""
                            }`}
                            aria-label={`Slide ${index + 1}`}
                            style={style.wh}
                            onClick={() =>
                              version?.attributes.forEach((f, index2) => {
                                handleClickItemAttribute({
                                  key: f?.key,
                                  value: f?.value,
                                  rowCel: [
                                    Number(index2),
                                    Number(
                                      findIndexByKeyValue(
                                        ProductDetail?.attributes,
                                        f?.key,
                                        f?.value
                                      )
                                    ),
                                  ],
                                  pdu: product,
                                });
                              })
                            }
                          >
                            <img
                              src={version.image}
                              className="d-block w-100"
                              alt=""
                            />
                          </button>
                        ))}
                    </div>
                  </div>

                  <div className="col-md-10 p-0">
                    {/* Large Image Carousel */}
                    <div className="carousel-inner" style={style.w500}>
                      {ProductDetail?.versions?.map((version, index) => (
                        <div
                          className={`carousel-item ${
                            index === 0 && verId == null
                              ? "active"
                              : verId === version.id
                              ? "active"
                              : ""
                          }`}
                          key={version.id}
                        >
                          <img
                            src={version.image}
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
                  {ProductDetail?.product?.productName || ""}
                </h4>

                <span className="mtext-106 cl2">
                  {price > 0
                    ? formatCurrencyVND(price)
                    : `${formatCurrencyVND(
                        ProductDetail?.product?.minPrice ?? "N/A"
                      )} - ${formatCurrencyVND(
                        ProductDetail?.product?.maxPrice ?? "N/A"
                      )}`}{" "}
                  {verName && <span className="fs-17"> - {verName}</span>}
                </span>

                <div className="stext-102 cl3 p-t-23">
                  Xem bảng <strong>hướng dẫn chọn size</strong> để lựa chọn sản
                  phẩm phụ hợp với bạn nhất{" "}
                  <button
                    onClick={toggleOffcanvas}
                    className="text-decoration-underline text-primary"
                  >
                    Tại đây
                  </button>
                </div>

                {/* <!--Làm việc chỗ nàyyyyyyyyyyyyy  --> */}
                <div className="p-t-33">
                  {
                    <AddCartItem
                      pd={product}
                      onClick={handleClickItemAttribute}
                      clickSave={handleClickSaveUpdateVersion}
                      message={err}
                    />
                  }
                </div>

                <div className="d-flex justify-content-center">
                  {/* <!--  --> */}
                  <div className="flex-w flex-m  p-t-40 respon7">
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

          <div className="bor10 m-t-50 p-t-43 p-b-40">
            {/* <!-- Tab01 --> */}
            <div className="tab01">
              {/* <!-- Nav tabs --> */}
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item p-b-10">
                  <a
                    className="nav-link active"
                    data-bs-toggle="tab"
                    href="#description"
                    role="tab"
                  >
                    Description
                  </a>
                </li>

                <li className="nav-item p-b-10">
                  <a
                    className="nav-link"
                    data-bs-toggle="tab"
                    href="#information"
                    role="tab"
                  >
                    Additional information
                  </a>
                </li>

                <li className="nav-item p-b-10">
                  <a
                    className="nav-link"
                    data-bs-toggle="tab"
                    href="#reviews"
                    role="tab"
                  >
                    Reviews ({feedBack?.totalElements ?? 0})
                  </a>
                </li>
              </ul>

              {/* <!-- Tab panes --> */}
              <div className="tab-content p-t-43">
                {/* <!-- Description Tab --> */}
                <div
                  className="tab-pane fade show active"
                  id="description"
                  role="tabpanel"
                >
                  <div className="how-pos2 p-lr-15-md">
                    <p className="stext-102 cl6">
                      {ProductDetail?.product?.description}
                    </p>
                  </div>
                </div>

                {/* <!-- Additional Information Tab --> */}
                <div className="tab-pane fade" id="information" role="tabpanel">
                  <div className="row">
                    <div className="col-sm-10 col-md-8 col-lg-6 m-lr-auto">
                      <ul className="p-lr-28 p-lr-15-sm">
                        {ProductDetail?.attributes?.length > 0 &&
                          ProductDetail?.attributes?.map((attribute, index) => (
                            <li className="flex-w flex-t p-b-7" key={index}>
                              <span className="stext-102 cl3 size-205">
                                {attribute?.key}
                              </span>
                              <div className="stext-102 cl6 size-206">
                                {attribute?.values?.length > 0 &&
                                  attribute?.values?.map(
                                    (value, valueIndex) => (
                                      <span className="me-2" key={valueIndex}>
                                        {value}
                                      </span>
                                    )
                                  )}
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* <!-- Reviews Tab --> */}
                <div className="tab-pane fade" id="reviews" role="tabpanel">
                  <div className="row">
                    <div className="col-sm-10 col-md-8 col-lg-6 m-lr-auto">
                      <div className="p-b-30 m-lr-15-sm">
                        {/* <!-- Review --> */}
                        {feedBack?.contents?.map((fb) => (
                          <div className="flex-w flex-t p-b-68">
                            <div className="wrap-pic-s size-109 bor0 of-hidden m-r-18 m-t-6">
                              <img src={fb?.user?.image} alt="User Avatar" />
                            </div>

                            <div className="size-207">
                              <div className="flex-w flex-sb-m p-b-17">
                                {/* User Name */}
                                <div className="d-flex align-items-center">
                                  <span className="mtext-107 cl2 p-r-20">
                                    {fb?.user?.fullName}
                                  </span>
                                  <p className="stext-104 cl6">
                                    {moment(fb?.feedbackDate)
                                      .subtract(8, "hours")
                                      .format("DD/MM/YYYY HH:mm")}
                                  </p>
                                </div>
                                <span className="fs-18 cl11">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <i
                                      key={i}
                                      className={`zmdi zmdi-star${
                                        i < fb?.rating ? "" : "-outline"
                                      }`}
                                    ></i>
                                  ))}
                                </span>
                              </div>

                              <p className="stext-102 cl6">{fb.comment}</p>
                              {fb?.images?.map((img, index) => (
                                <img
                                  key={index}
                                  className="w-25 me-2 mb-3"
                                  src={img}
                                  alt={`Img ${index}`}
                                />
                              ))}
                   
                   {fb?.reply && (
                              <div className="bg-body-secondary p-3">
                                <p className="stext-102 cl6">
                                  Phản hồi của người bán:
                                </p>
                                {/* Reply Section */}
                                {fb?.reply && (
                                  <div className="flex-w flex-t reply-section">
                                    <div className="wrap-pic-s size-109 bor0 of-hidden m-r-18 m-t-6">
                                      <img
                                        src={logo}
                                        alt="Reply Avatar"
                                      />
                                    </div>
                                    <div>
                                      <span className="mtext-107 cl2">
                                     STTF STORE
                                      </span>
                                      <p className="stext-102 cl6">
                                        {fb?.reply?.content}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </div>       )}
                            </div>
                          </div>
                        ))}
                        {feedBack?.totalElements > 0 && (
                          <div className="w-100 d-flex justify-content-end">
                            <div className="pagination">
                              <button
                                className="stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5"
                                onClick={() =>
                                  handlePageChange(feedBackPage - 1)
                                }
                                disabled={feedBackPage === 1}
                              >
                                Previous
                              </button>
                              <span className="stext-106 cl6 bor3 trans-04 m-r-32 m-tb-5">
                                Page {feedBackPage} of{" "}
                                {feedBack?.totalPage || 1}
                              </span>
                              <button
                                className="stext-106 cl6 hov1 bor3 trans-04 m-r-32 m-tb-5"
                                onClick={() =>
                                  handlePageChange(feedBackPage + 1)
                                }
                                disabled={feedBackPage === feedBack?.totalPage}
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg6 flex-c-m flex-w size-302 m-t-73 p-tb-15">
          <span className="stext-107 cl6 p-lr-25">SKU: JAK-01</span>

          <span className="stext-107 cl6 p-lr-25">Categories: Jacket, Men</span>
        </div>
      </section>

      {/* <!-- Related Products --> */}
      <section className="sec-relate-product bg0 p-t-45 p-b-105">
        <div className="p-3">
          <div className="p-b-45">
            <h3 className="ltext-106 cl5 txt-center">Related Products</h3>
          </div>

          <section className="sec-relate-product bg0 p-t-45 p-b-64">
            <div className="p-3 pt-0 pb-0">
              {/* <!-- Slide2 --> */}
              <div className="wrap-slick2">
                <div className="row isotope-grid">
                  {!Products || Products?.length ? (
                    Products?.map((product, index) => (
                      <div
                        key={index}
                        className="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item women"
                      >
                        <div className="block2">
                          <div className="block2-pic hov-img0">
                            <img src={product?.imgName} alt="IMG-PRODUCT" />
                            {/* Quick View */}
                            <Link
                              to={`/product-detail/${product?.id}`}
                              type="button"
                              className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 text-decoration-none "
                            >
                              View
                            </Link>
                          </div>

                          <div className="block2-txt flex-w flex-t p-t-14">
                            <div className="block2-txt-child1 flex-col-l">
                              <Link
                                to={`/product-detail/${product?.id}`}
                                className="text-decoration-none stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
                              >
                                {product?.name}
                              </Link>

                              <span className="stext-105 cl3">
                                {`
  ${
    product?.minPrice !== product?.maxPrice
      ? `${formatCurrencyVND(product?.minPrice ?? "N/A")} ~ `
      : ""
  }
  ${formatCurrencyVND(product?.maxPrice ?? "N/A")}
`}
                              </span>
                            </div>

                            <div className="block2-txt-child2 flex-r p-t-3">
                              <Wish
                                prodID={product?.id}
                                isWish={product?.like}
                                handleAddWish={() => {
                                  handleAddWishlist(product?.id);
                                }}
                                handleRemoveWish={() =>
                                  handleRemoveWishlist(product?.id)
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="d-flex justify-content-center mt-5 mb-5">
                      <div className=" pt-5 pb-5 opacity-50">
                        <p className="fs-4 text-muted mt-3">{ErrorMessage}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
          {/* <!-- Load more --> */}
          <div className="flex-c-m flex-w w-full">
            <span
              href="#"
              className="text-decoration-none flex-c-m stext-101 cl5 size-103 bg2 bor1 p-lr-15 trans-04"
            >
              END
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
export default ProductDetail;

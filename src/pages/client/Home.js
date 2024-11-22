import React, { useEffect, useState, useCallback } from "react";
import Slider from "../../components/client/homeItem/Slider";
import { Link } from "react-router-dom";
import productApi from "../../services/api/ProductApi";
import AddCartItem from "../../components/client/AddCartItem/AddCartItem";
import DangerAlert from "../../components/client/sweetalert/DangerAlert";
import SuccessAlert from "../../components/client/sweetalert/SuccessAlert";
import ConfirmAlert from "../../components/client/sweetalert/ConfirmAlert";
import InfoAlert from "../../components/client/sweetalert/InfoAlert";
import { stfExecAPI, ghnExecAPI } from "../../stf/common";
import Wish from "../../components/client/ProdWish/Wish";
import { useDispatch } from "react-redux";
import banner1 from "../../assets/images/banner-01.jpg";
import banner2 from "../../assets/images/banner-02.jpg";
import banner3 from "../../assets/images/banner-03.jpg";
import CouponCard from "./CouponCard";

import { incrementCart } from "../../store/actions/cartActions";
import SizeGuide from "../../components/client/Modal/SizeGuideModal";
import { toast } from "react-toastify";
import moment from "moment";

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

function formatCurrencyVND(amount) {
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

const getEndDate = (end) => {
  const now = moment(); // Lấy thời gian hiện tại
  const endDate = moment(end, "DD/MM/YYYY HH:mm"); // Chuyển đổi chuỗi thành moment
  
  if (!endDate.isValid()) {
    return "Ngày giờ không hợp lệ"; // Kiểm tra nếu thời gian không hợp lệ
  }

  const diffInMilliseconds = endDate.diff(now); // Tính chênh lệch
  console.log("Ty@", diffInMilliseconds, end);

  if (diffInMilliseconds <= 0) {
    return "Đã hết hạn";
  }

  const duration = moment.duration(diffInMilliseconds);

  const years = duration.years();
  const months = duration.months();
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();

  if (years > 0) {
    return `${years} năm`;
  } else if (months > 0) {
    return `${months} tháng`;
  } else if (days > 0) {
    return `${days} ngày`;
  } else if (hours > 0) {
    return `${hours} giờ`;
  } else {
    return `${minutes} phút`;
  }
};

const Home = () => {
  const dispatch = useDispatch();

  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  const toggleOffcanvas = () => {
    setIsOffcanvasOpen((prev) => !prev);
  };

  const [Products, setProducts] = useState([]);
  const [ProductDetail, setProductDetail] = useState();
  const [ErrorCode] = useState("204");
  const [ErrorMessage] = useState("No products found");

  //Minh ty làm *************************************
  const [product, setProduct] = useState([]);
  const [attriTest, setAttriTest] = useState([]);
  const [pd, setPd] = useState();
  const [err, setErr] = useState();
  const [price, setPrice] = useState(0);
  const [verName, setVername] = useState();

  const [verId, setVerId] = useState(null);

  const [priceMin, setPriceMin] = useState();
  const [priceMax, setPriceMax] = useState();
  const [discounts, setDiscounts] = useState([]);

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

      const values = versionTemps?.map((vs) => {
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
      const arrs = [...products.attributes]?.map((a) => {
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
    const tem = attriTest?.map((o) => {
      const isEqual = o?.key?.toLowerCase() == key?.toLowerCase();
      return isEqual ? { ...o, value: value } : o;
    });

    setAttriTest(tem);
    console.log(53453453534534534534, tem);
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

  //****************************************** */

  console.log(ProductDetail);

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

  const findProductDetailById = async (id) => {
    try {
      const response = await productApi.getProductDetail(id);

      return response.data.data;
    } catch (error) {
      console.error("Error fetching product:", error.message);
    }
  };

  const handleProductClick = async (id) => {
    const product = await findProductDetailById(id);

    console.log("Ty", product);
    getProductDetail(id);

    setPd(product);
    setProduct(
      partitionProduct(
        product,
        product?.attributes,
        getRowCelCick(product?.versions?.attributes, product?.attributes[0]),
        product?.attributes[0]?.key
      )
    );
    setAttriTest(product?.attributes);
    setVername();
    setVerId(null);
  };

  const style = {
    w500: { width: "100%" },
    wh: { width: "100px", height: "126px" },
  };
  const handleCheckColorAndSize = (key, value) => {
    let attribute = [];
    ProductDetail.versions.forEach((element) => {});
  };

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

  const findIndexByKeyValue = (attributes, key, value) => {
    const attribute = attributes.find((attr) => attr.key === key);
    console.log(
      attribute && attribute.values ? attribute.values.indexOf(value) : -1
    );
    return attribute && attribute.values ? attribute.values.indexOf(value) : -1;
  };

  //Đổ danh sách coupon cho user lấy
  useEffect(() => {
    const fetchCoupon = async () => {
      const [error, data] = await stfExecAPI({
        method: "get",
        url: "api/user/get-all-coupon-home",
      });

      if (data) {
        setDiscounts(data.data);
      }
    };

    fetchCoupon();
  }, []);

  const fetchCoupon = async () => {
    const [error, data] = await stfExecAPI({
      method: "get",
      url: "api/user/get-all-coupon-home",
    });

    if (data) {
      setDiscounts(data.data);
    }
  };


  const saveCoupon = async ({ couponId, code }) => {
    const [error, data] = await stfExecAPI({
      method: "post",
      url: "api/user/get-coupon/add",
      data: { couponId: couponId, code: code },
    });

    if (error) {
      const err =
        error.status === 403
          ? "Account does not have permission to perform this function"
          : error?.response?.data?.message;

      toast.error(`${err}`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      fetchCoupon();
      return;
    }

    fetchCoupon();

    toast.success(`Lưu thành công mã giảm giá`, {
      className: "toast-message",
      position: "top-right",
      autoClose: 5000,
    });
  };

  return (
    <div>
      <Slider />
      <SizeGuide isOpen={isOffcanvasOpen} onClose={toggleOffcanvas} />
      {/* <!-- Banner --> */}

      <div className="sec-banner bg0 p-t-80">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-xl-4 p-b-30 m-lr-auto">
              {/* <!-- Block1 --> */}
              <div className="block1 wrap-pic-w">
                <img src={banner1} alt="IMG-BANNER" />

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
                <img src={banner2} alt="IMG-BANNER" />

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
                <img src={banner3} alt="IMG-BANNER" />

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

      <div className="container mt-5 px-5">
        <div className="row row-cols-md-3 row-cols-1">
          {discounts &&
            discounts.map((item) => {
              return (
                <div key={item.code} className="col">
                  <CouponCard
                    code={item.code}
                    discount={
                      item.disPercent
                        ? item.disPercent + " %"
                        : formatCurrencyVND(item.disPrice)
                    }
                    name={getEndDate(item.endDate)}
                    onSave={() => {
                      saveCoupon({ couponId: item.id, code: item.code });
                    }}
                  />
                </div>
              );
            })}
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
                          <button
                            type="button"
                            className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04 text-decoration-none "
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                            onClick={() => handleProductClick(product?.id)}
                          >
                            Quick View
                          </button>
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
                          {ProductDetail?.versions?.length > 0 &&
                            ProductDetail?.versions?.map((version, index) => (
                              <button
                                key={version.id}
                                type="button"
                                data-bs-target="#productCarousel"
                                data-bs-slide-to={index}
                                className={`${
                                  (index === 0 &&
                                    (verId == null || verId == undefined)) ||
                                  verId === version.id
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
                      {ProductDetail ? ProductDetail?.product?.productName : ""}
                    </h4>

                    <span className="mtext-106 cl2">
                      {" "}
                      {Products?.map((product1, index) =>
                        product1?.id == ProductDetail?.product?.id ? (
                          <span className="mtext-106 cl2">
                            {price > 0
                              ? formatCurrencyVND(price)
                              : `${formatCurrencyVND(
                                  ProductDetail?.product?.minPrice ?? "N/A"
                                )} - ${formatCurrencyVND(
                                  ProductDetail?.product?.maxPrice ?? "N/A"
                                )}`}{" "}
                            {verName && (
                              <span className="fs-17"> - {verName}</span>
                            )}
                          </span>
                        ) : null
                      )}
                    </span>

                    <div className="stext-102 cl3 p-t-23">
                      Xem bảng <strong>hướng dẫn chọn size</strong> để lựa chọn
                      sản phẩm phụ hợp với bạn nhất{" "}
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

                      {/* <div className="flex-w flex-r-m p-b-10 mt-3">
                        <div className="size-204 flex-w flex-m respon6-next">
                          <button className="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04 js-addcart-detail">
                            Add to cart
                          </button>
                        </div>
                      </div> */}
                    </div>

                    {/* <!--  --> */}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

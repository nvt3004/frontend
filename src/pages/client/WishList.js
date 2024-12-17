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

import { incrementCart } from "../../store/actions/cartActions";
import SizeGuide from "../../components/client/Modal/SizeGuideModal";

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
const WishList = () => {
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
  const [salePrice, setSalePrice] = useState(0);
  const [sale, setSale] = useState(0);
  const [verName, setVername] = useState();

  const [verId, setVerId] = useState(null);

  const [priceMin, setPriceMin] = useState();
  const [priceMax, setPriceMax] = useState();

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
          setSale(vs.sale);
          setSalePrice(vs.salePrice);
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
      setErr("Vui lòng chọn hết các thuộc tính!");
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
      title: "Thành công!",
      text: "Thêm sản phẩm vào giỏ hàng thành công!",
    });
  };

  //****************************************** */

  console.log(ProductDetail);

  useEffect(() => {
    const fetchWishList = async () => {
      try {
        const response = await productApi.getProductWish();
        setProducts(response);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    fetchWishList();
  }, []);
  const getProductDetail = async (id) => {
    try {
      const response = await productApi.getProductDetail(id);
      setProductDetail(response.data.data);
      setPrice(null);
      setSale(null);
      setSalePrice(null);
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
  function formatCurrencyVND(amount) {
    return amount?.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }
  const findIndexByKeyValue = (attributes, key, value) => {
    const attribute = attributes.find((attr) => attr.key === key);
    return attribute && attribute.values ? attribute.values.indexOf(value) : -1;
  };
  const style = {
    m: { marginTop: "80px", minHeight: "80vh" },
    h: { minHeight: "60vh" },
    w500: { width: "100%" },
    wh: { width: "100px", height: "126px" },
  };

  return (
    <div style={style.m}>
      <SizeGuide isOpen={isOffcanvasOpen} onClose={toggleOffcanvas} />
      <section className="bg0 p-t-23 p-b-140">
        <div className="container">
          <div className="p-b-10 mb-4">
            <h3 className="ltext-103 cl5">Danh sách yêu thích</h3>
          </div>
          <div className="row isotope-grid" style={style.h}>
            {!Products || Products?.length ? (
              Products?.map((product, index) => (
                <div
                  key={index}
                  className="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item women position-relative"
                >
                  {product?.quantity === 0 && (
                    <div
                      className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center text-white fw-bold"
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 5,
                        borderRadius: "0.5rem",
                      }}
                    >
                      HẾT HÀNG
                    </div>
                  )}
                  <div className="block2">
                    <div className="block2-pic hov-img0">
                      {product?.discountPercent > 0 && (
                        <span className="position-absolute right-0 zindex-4 bg-body-secondary p-2 rounded-3">
                          {`-${product?.discountPercent}%`}
                        </span>
                      )}
                      <img src={product?.imgName} alt="IMG-PRODUCT" />
                      {/* Quick View */}
                      <button
                        type="button"
                        className="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 text-decoration-none "
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        onClick={() => handleProductClick(product?.id)}
                      >
                        Xem
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
                          {product?.minPriceSale && product?.maxPriceSale ? (
                            <>
                              <span className="text-decoration-line-through text-muted">
                                {/* Giá gốc */}
                                {product?.minPrice !== product?.maxPrice &&
                                  `${formatCurrencyVND(
                                    product?.minPrice ?? "N/A"
                                  )} ~ `}
                                {formatCurrencyVND(product?.maxPrice ?? "N/A")}
                              </span>
                              <br />
                              <span className="text-danger fw-bold">
                                {/* Giá khuyến mãi */}
                                {product?.minPriceSale !==
                                  product?.maxPriceSale &&
                                  `${formatCurrencyVND(
                                    product?.minPriceSale ?? "N/A"
                                  )} ~ `}
                                {formatCurrencyVND(
                                  product?.maxPriceSale ?? "N/A"
                                )}
                              </span>
                            </>
                          ) : (
                            <>
                              {" "}
                              <span className="stext-105 cl3">
                                {/* Giá gốc */}
                                {product?.minPrice !== product?.maxPrice &&
                                  `${formatCurrencyVND(
                                    product?.minPrice ?? "N/A"
                                  )} ~ `}
                                {formatCurrencyVND(product?.maxPrice ?? "N/A")}
                              </span>
                            </>
                          )}
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
      </section>
      {/*  */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content rounded-4">
            <div className="modal-header pb-1 pt-2">
              <h1
                className="modal-title flex-c-m stext-101 cl5 size-103  p-lr-15"
                id="exampleModalLabel"
              >
                Thông tin sản phẩm
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
                      <div className="col-md-2">
                        {/* Thumbnail Images as Indicators */}
                        <div className="carousel-indicators flex-column h-100 m-0 overflow-auto custom-scrollbar">
                          <span style={{ marginTop: "150px" }}></span>
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
                                    ? "active position-relative"
                                    : "position-relative"
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
                                {version?.quantity === 0 && (
                                  <div
                                    className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center text-white fw-bold"
                                    style={{
                                      backgroundColor: "rgba(0, 0, 0, 0.5)", // Nền đen mờ
                                      zIndex: 4,
                                      borderRadius: "0.5rem",
                                    }}
                                  >
                                    HẾT HÀNG
                                  </div>
                                )}
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
                                  ? "active position-relative"
                                  : verId === version.id
                                  ? "active position-relative"
                                  : "position-relative"
                              }`}
                              key={version.id}
                            >
                              {" "}
                              {version?.quantity === 0 && (
                                <div
                                  className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center text-white fw-bold"
                                  style={{
                                    backgroundColor: "rgba(0, 0, 0, 0.5)", // Nền đen mờ
                                    zIndex: 4,
                                    borderRadius: "0.5rem",
                                  }}
                                >
                                  HẾT HÀNG
                                </div>
                              )}
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
                  <div className="p-r-50 p-t-5 p-lr-0-lg mt-5">
                    <h4 className="mtext-105 cl2 js-name-detail p-b-14">
                      {ProductDetail ? ProductDetail?.product?.productName : ""}
                    </h4>

                    <span className="mtext-106 cl2">
                      {Products?.map((product1, index) =>
                        product1?.id == ProductDetail?.product?.id ? (
                          <div className="mtext-106 cl2">
                            {price > 0 ? (
                              <div>
                                {salePrice > 0 ? (
                                  <span className="text-decoration-line-through text-muted">
                                    {formatCurrencyVND(price)}
                                  </span>
                                ) : (
                                  <span>{formatCurrencyVND(price)}</span>
                                )}
                                {sale > 0 ? (
                                  <span className="bg-body-secondary p-2 rounded-3 ms-3">
                                    -{sale}%
                                  </span>
                                ) : (
                                  ""
                                )}{" "}
                                <br />
                                <span className="text-danger fw-bold">
                                  {formatCurrencyVND(salePrice)}
                                </span>
                              </div>
                            ) : (
                              `${formatCurrencyVND(
                                ProductDetail?.product?.minPrice ?? "N/A"
                              )} - ${formatCurrencyVND(
                                ProductDetail?.product?.maxPrice ?? "N/A"
                              )}`
                            )}{" "}
                          </div>
                        ) : null
                      )}
                    </span>
                    <div className="mt-3">
                      {verName && <span className="fs-17">{verName}</span>}
                    </div>
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
                    {/* <div className="d-flex justify-content-center">
                
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
                    </div> */}
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

export default WishList;

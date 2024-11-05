import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";
import "../../assets/style/custom-scroll.css";
import QuickViewProdDetail from "../../components/client/Modal/QuickViewProdDetail";

import { stfExecAPI, ghnExecAPI } from "../../stf/common";
import ava from "../../assets/images/avatar-01.jpg"
import productApi from "../../services/api/ProductApi";
import AddCartItem from "../../components/client/AddCartItem/AddCartItem";
import DangerAlert from "../../components/client/sweetalert/DangerAlert";
import SuccessAlert from "../../components/client/sweetalert/SuccessAlert";

import { useDispatch } from "react-redux";

import { incrementCart } from "../../store/actions/cartActions";

import heart1 from "../../assets/images/icons/icon-heart-01.png"
import heart2 from "../../assets/images/icons/icon-heart-02.png"
import prod12 from "../../assets/images/product-01.jpg"

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


  //Minh ty làm *************************************
  const [product, setProduct] = useState([]);
  const [ProductDetail, setProductDetail] = useState();
  const [attriTest, setAttriTest] = useState([]);
  const [pd, setPd] = useState();
  const [err, setErr] = useState();
  const [price, setPrice] = useState(0);


  const [rating, setRating] = useState(0); // Trạng thái lưu số sao được chọn
   // Lấy param từ URL (nếu có)
   const { id: paramId } = useParams();
   // Lấy query param từ URL
   const location = useLocation();
   const queryParams = new URLSearchParams(location.search);
   const queryId = queryParams.get("id");
   // Ưu tiên param ID, nếu không có thì lấy query param
   const [productId, setProductId] = useState(null);
 


   
   useEffect(() => {
    const fetchProductDetail = async () => {
      const id = paramId || queryId;
      if (id) {
        setProductId(id);  // Đặt productId theo `paramId` hoặc `queryId`
        
        try {
          const response = await productApi.getProductDetail(id);
          setProductDetail(response.data.data); // Lưu chi tiết sản phẩm vào state
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
    DangerAlert({
      text:
        `${error?.response?.data?.code}: ${error?.response?.data?.message}` ||
        "Server error",
    });
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

const handleProductClick = async (id) => {
  const product = await findProductDetailById(id);

  console.log("Ty", product);
  getProductDetail(id);

  setPd(product);
  setProduct(
    partitionProduct(
      product,
      product.attributes,
      getRowCelCick(product.versions.attributes, product.attributes[0]),
      product.attributes[0].key
    )
  );
  setAttriTest(product.attributes);
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
  
  function formatCurrencyVND(amount) {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }
  const handleRating = (index) => {
    setRating(index); // Cập nhật trạng thái khi người dùng chọn sao
  };
  const style = {
    m: { marginTop: "80px" },
    w500: { width: "100%" },
    wh: { width: "100px", height: "126px" },
  };
  return (
    <div className="container" style={style.m}>
      {/* <!-- Product Detail --> */}
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
                          {ProductDetail &&
                            ProductDetail?.versions &&
                            ProductDetail?.versions?.length > 0 &&
                            ProductDetail?.versions?.map((version, index) => (
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
                                  src={version?.images}
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
                            ProductDetail?.versions &&
                            ProductDetail?.versions?.length > 0 &&
                            ProductDetail?.versions.map((version, index) => (
                              <div
                                className={`carousel-item ${
                                  index === 0 ? "active" : ""
                                }`}
                                key={index}
                              >
                                <img
                                  src={version?.images}
                                  className="d-block w-100"
                                  alt={version?.versionName}
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
                      {" "} 123456
                      {/* {Products.map((product1, index) =>
                        product1?.id == ProductDetail?.product?.id ? (
                          <span key={index}>
                            {`
  ${
    product1?.minPrice !== product1?.maxPrice
      ? `${formatCurrencyVND(product1?.minPrice ?? "N/A")} ~ `
      : ""
  }
  ${formatCurrencyVND(product1?.maxPrice ?? "N/A")}
`}
                          </span>
                        ) : null
                      )} */}
                    </span>

                    <p className="stext-102 cl3 p-t-23">
                      Xem bảng <strong>hướng dẫn chọn size</strong> để lựa chọn
                      sản phẩm phụ hợp với bạn nhất <Link>tại đây</Link>
                    </p>

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
                    Reviews (1)
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
                      Aenean sit amet gravida nisi. Nam fermentum est felis,
                      quis feugiat nunc fringilla sit amet. Ut in blandit ipsum.
                      Quisque luctus dui at ante aliquet, in hendrerit lectus
                      interdum. Morbi elementum sapien rhoncus pretium maximus.
                      Nulla lectus enim, cursus et elementum sed, sodales vitae
                      eros. Ut ex quam, porta consequat interdum in, faucibus eu
                      velit. Quisque rhoncus ex ac libero varius molestie.
                      Aenean tempor sit amet orci nec iaculis. Cras sit amet
                      nulla libero. Curabitur dignissim, nunc nec laoreet
                      consequat, purus nunc porta lacus, vel efficitur tellus
                      augue in ipsum. Cras in arcu sed metus rutrum iaculis.
                      Nulla non tempor erat. Duis in egestas nunc.
                    </p>
                  </div>
                </div>

                {/* <!-- Additional Information Tab --> */}
                <div className="tab-pane fade" id="information" role="tabpanel">
                  <div className="row">
                    <div className="col-sm-10 col-md-8 col-lg-6 m-lr-auto">
                      <ul className="p-lr-28 p-lr-15-sm">
                        <li className="flex-w flex-t p-b-7">
                          <span className="stext-102 cl3 size-205">Weight</span>

                          <span className="stext-102 cl6 size-206">
                            0.79 kg
                          </span>
                        </li>

                        <li className="flex-w flex-t p-b-7">
                          <span className="stext-102 cl3 size-205">
                            Dimensions
                          </span>

                          <span className="stext-102 cl6 size-206">
                            110 x 33 x 100 cm
                          </span>
                        </li>

                        <li className="flex-w flex-t p-b-7">
                          <span className="stext-102 cl3 size-205">
                            Materials
                          </span>

                          <span className="stext-102 cl6 size-206">
                            60% cotton
                          </span>
                        </li>

                        <li className="flex-w flex-t p-b-7">
                          <span className="stext-102 cl3 size-205">Color</span>

                          <span className="stext-102 cl6 size-206">
                            Black, Blue, Grey, Green, Red, White
                          </span>
                        </li>

                        <li className="flex-w flex-t p-b-7">
                          <span className="stext-102 cl3 size-205">Size</span>

                          <span className="stext-102 cl6 size-206">
                            XL, L, M, S
                          </span>
                        </li>
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
                        <div className="flex-w flex-t p-b-68">
                          <div className="wrap-pic-s size-109 bor0 of-hidden m-r-18 m-t-6">
                            <img src={ava} alt="AVATAR" />
                          </div>

                          <div className="size-207">
                            <div className="flex-w flex-sb-m p-b-17">
                              <span className="mtext-107 cl2 p-r-20">
                                Ariana Grande
                              </span>

                              <span className="fs-18 cl11">
                                <i className="zmdi zmdi-star"></i>
                                <i className="zmdi zmdi-star"></i>
                                <i className="zmdi zmdi-star"></i>
                                <i className="zmdi zmdi-star"></i>
                                <i className="zmdi zmdi-star-half"></i>
                              </span>
                            </div>

                            <p className="stext-102 cl6">
                              Quod autem in homine praestantissimum atque
                              optimum est, id deseruit. Apud ceteros autem
                              philosophos
                            </p>
                          </div>
                        </div>

                        {/* <!-- Add review --> */}
                        <form className="w-full">
                          <h5 className="mtext-108 cl2 p-b-7">Add a review</h5>

                          <p className="stext-102 cl6">
                            Your email address will not be published. Required
                            fields are marked *
                          </p>

                          <div className="flex-w flex-m p-t-50 p-b-23">
                            <span className="stext-102 cl3 m-r-16">
                              Your Rating
                            </span>

                            <span className="wrap-rating fs-18 cl11 pointer">
                              {[...Array(5)].map((_, index) => (
                                <i
                                  key={index}
                                  className={`item-rating pointer zmdi ${
                                    index < rating
                                      ? "zmdi-star"
                                      : "zmdi-star-outline"
                                  }`}
                                  onClick={() => handleRating(index + 1)}
                                ></i>
                              ))}
                              <input
                                className="dis-none"
                                type="number"
                                name="rating"
                                value={rating}
                                readOnly
                              />
                            </span>
                          </div>

                          <div className="row p-b-25">
                            <div className="col-12 p-b-5">
                              <label className="stext-102 cl3" for="review">
                                Your review
                              </label>
                              <textarea
                                className="size-110 bor8 stext-102 cl2 p-lr-20 p-tb-10"
                                id="review"
                                name="review"
                              ></textarea>
                            </div>

                            <div className="col-sm-6 p-b-5">
                              <label className="stext-102 cl3" for="name">
                                Name
                              </label>
                              <input
                                className="size-111 bor8 stext-102 cl2 p-lr-20"
                                id="name"
                                type="text"
                                name="name"
                              />
                            </div>

                            <div className="col-sm-6 p-b-5">
                              <label className="stext-102 cl3" for="email">
                                Email
                              </label>
                              <input
                                className="size-111 bor8 stext-102 cl2 p-lr-20"
                                id="email"
                                type="text"
                                name="email"
                              />
                            </div>
                          </div>

                          <button className="flex-c-m stext-101 cl0 size-112 bg7 bor11 hov-btn3 p-lr-15 trans-04 m-b-10">
                            Submit
                          </button>
                        </form>
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

          {/* <!-- Slide2 --> */}
          <div className="wrap-slick2">
            <div className="row isotope-grid">
              <div className="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item women">
                {/* <!-- Block2 --> */}
                <div className="block2">
                  <div className="block2-pic hov-img0">
                    <img src={prod12} alt="IMG-PRODUCT" />

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
                          src={heart1}
                          alt="ICON"
                        />
                        <img
                          className="icon-heart2 dis-block trans-04 ab-t-l"
                          src={heart2}
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
            <div className="flex-c-m flex-w w-full p-t-45">
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
export default ProductDetail;
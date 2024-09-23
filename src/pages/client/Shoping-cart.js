import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllProvince,
  getAllDistrictByProvince,
  getAllWardByDistrict,
} from "../../services/api/ghnApi";
import DangerAlert from "../../components/client/sweetalert/DangerAlert";
import SuccessAlert from "../../components/client/sweetalert/SuccessAlert";
import ConfirmAlert from "../../components/client/sweetalert/ConfirmAlert";
import InfoAlert from "../../components/client/sweetalert/InfoAlert";
import { useForm } from "react-hook-form";
import { stfExecAPI, ghnExecAPI } from "../../stf/common";

const getEndDate = (end) => {
  const now = new Date();
  const endDate = new Date(end);

  const diffInMilliseconds = endDate - now;

  if (diffInMilliseconds <= 0) {
    return "Đã hết hạn";
  }

  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInMonths / 12);

  if (diffInYears > 0) {
    return `${diffInYears} năm`;
  } else if (diffInMonths > 0) {
    return `${diffInMonths} tháng`;
  } else if (diffInDays > 0) {
    return `${diffInDays} ngày`;
  } else if (diffInHours > 0) {
    return `${diffInHours} giờ`;
  } else {
    return `${diffInMinutes} phút`;
  }
};

function getNameAddress(nameId) {
  return nameId.substring(nameId.indexOf(" "), nameId.length).trim();
}

function getIdAddress(name) {
  return name.substring(0, name.indexOf(" ")).trim();
}

function formatCurrencyVND(amount) {
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function getPercentage(number) {
  const total = 100;
  return number / total;
}

const ShopingCart = () => {
  const [carts, setCarts] = useState([]);

  //ví dụ
  const [ProductID, setProductID] = useState(1);
  const [VersionID, setVersionID] = useState([]);
  //
  const [Coupon, setCoupon] = useState(-1);
  const [iputEnter, setIputEnter] = useState("");
  const [coupons, setCoupons] = useState([]);
  //
  const [address, setAddress] = useState();
  const [Note, setNote] = useState("");
  //==========================================
  // State để lưu trữ trạng thái của checkbox tổng
  const [selectAll, setSelectAll] = useState(false);

  // State để lưu trữ trạng thái của từng checkbox con, và VersionID
  const [selectedItems, setSelectedItems] = useState([]);

  const [version, setVersion] = useState(-1);
  const [versions, setVersions] = useState([]);
  const [idUpdate, setIdUpdate] = useState(-1);

  const [addresses, setAddresses] = useState([]);
  const [addressTitle, setAddressTitle] = useState("");
  const [fee, setFee] = useState();
  const [subTotal, setSubTotal] = useState(0);
  const [couponRead, setCouponRead] = useState("");
  const [total, setTotal] = useState(0);
  const [pay, setPay] = useState(true);

  //Đổ danh sách cart của user
  useEffect(() => {
    const fetchCarts = async () => {
      const [error, data] = await stfExecAPI({
        url: "api/user/cart/all",
      });

      if (data) {
        setCarts(data.data);
      }
    };

    fetchCarts();
  }, []);

  //Đổ danh sách coupon đã lưu của user
  useEffect(() => {
    const fetchCoupon = async () => {
      const [error, data] = await stfExecAPI({
        url: "api/user/get-all-coupon",
      });

      if (data) {
        setCoupons(data.data);
      }
    };

    fetchCoupon();
  }, []);

  //Tổng tiền các sản phẩm được chọn
  const totalPrice = useCallback((carts) => {
    let total = 0;
    if (!carts) {
      return 0;
    }

    carts.forEach((e) => {
      total += e.price * e.quantity;
    });

    return total;
  }, []);

  //Xóa cart item
  const handleDeleteCartItem = async (id) => {
    const isDelete = await ConfirmAlert({
      title: "Delete cart item",
      text: "Are you sure you want to delete?",
      cancelText: "Cancel",
      confirmText: "Delete",
    });

    if (!isDelete) return;

    const [error, data] = await stfExecAPI({
      method: "delete",
      url: `api/user/cart/remove/${id}`,
    });

    if (error) {
      DangerAlert({
        text:
          `${error?.response?.data?.code}: ${error?.response?.data?.message}` ||
          "Server error",
      });
      return;
    }

    const temp = [...selectedItems].filter((o) => o.catrItemId !== id);

    setSelectedItems(temp);
    setSubTotal(totalPrice(temp));

    setCarts(carts.filter((c) => c.catrItemId !== id));

    SuccessAlert({
      text: "Delete cart item success!",
    });
  };

  //Thanh toán
  const handleProceedToCheckout = async () => {
    if (selectedItems.length <= 0) {
      InfoAlert({
        text: "Please select product before checkout!",
      });
      return;
    }

    if (!address) {
      InfoAlert({
        text: "Please select address before checkout!",
      });
      return;
    }

    if (couponRead.trim() !== "") {
      const [error, data] = await stfExecAPI({
        url: `api/user/coupon/${iputEnter}`,
      });

      if (error) {
        InfoAlert({
          text: "Coupon not found!",
        });
        return;
      }
    }

    //Pay == true thanh toán khi nhận hàng , ngược lại VNPay
    const detail = [...selectedItems].map((i) => {
      return {
        idVersion: i.versionId,
        quantity: i.quantity,
      };
    });

    if (pay) {
      const [error, data] = await stfExecAPI({
        method: "post",
        url: `api/user/cart/checkout`,
        data: {
          address: addressTitle,
          couponCode: iputEnter || null,
          creatorIsAdmin: false,
          statusId: 1,
          paymentMethodId: 2,
          orderDetails: detail,
        },
      });

      if (error) {
        DangerAlert({
          text:
            `${error?.response?.data?.code}: ${error?.response?.data?.message}` ||
            "Server error",
        });
        return;
      }

      //Đổ coupon
      const fetchCoupon = async () => {
        const [error, data] = await stfExecAPI({
          url: "api/user/get-all-coupon",
        });

        if (data) {
          setCoupons(data.data);
        }
      };

      fetchCoupon();

      //Đổ carts
      const fetchCarts = async () => {
        const [error, data] = await stfExecAPI({
          url: "api/user/cart/all",
        });

        if (data) {
          setCarts(data.data);
        }
      };

      fetchCarts();

      setSubTotal(0);
      setTotal(0);
      setCouponRead("");
      setIputEnter("");

      SuccessAlert({
        text: "Checkout success!",
      });
    } else {
      const [error, data] = await stfExecAPI({
        method: "post",
        url: `api/vnp/create-payment`,
        data: {
          address: addressTitle,
          couponCode: iputEnter || null,
          creatorIsAdmin: false,
          fee: fee,
          statusId: 1,
          paymentMethodId: 2,
          orderDetails: detail,
          vnpay: {
            orderInfo: "Thanh toán đơn hàng chuyển khoản",
            bankCode: "NCB",
          },
        },
      });

      if (error) {
        DangerAlert({
          text:
            `${error?.response?.data?.code}: ${error?.response?.data?.message}` ||
            "Server error",
        });
        return;
      }

      window.location.href = data.data;
    }
  };

  //Chọn coupon
  const handleCoupon = (event) => {
    const v = event.target.value.trim();
    if (v === "" || v == -1) {
      setCouponRead("");
    }
    setCoupon(v === "" ? -1 : v);
    setIputEnter(coupons.find((o) => o.id == v)?.couponCode || "");
  };

  //Nhập coupon
  const handleInputCoupon = (event) => {
    const v = event.target.value.trim();
    setIputEnter(v);
    setCoupon(-1);
  };

  //Click edit version
  const handleClickEditVersion = (idUpdate, versionIdSelected, versions) => {
    setVersion(versionIdSelected);
    setVersions(versions);
    setIdUpdate(idUpdate);
  };

  //Cập nhật version trong giỏ hàng
  const handleUpdateVersionCart = async () => {
    const [error, data] = await stfExecAPI({
      method: "put",
      url: "api/user/cart/update-item",
      data: {
        cartItemId: idUpdate,
        versionId: version,
      },
    });

    if (error) {
      DangerAlert({
        text:
          `${error?.response?.data?.code}: ${error?.response?.data?.message}` ||
          "Server error",
      });
      return;
    }

    const fetchCarts = async () => {
      const [error, data] = await stfExecAPI({
        url: "api/user/cart/all",
      });

      if (data) {
        setCarts(data.data);
        const newItemUpdate = data?.data.find((o) => o.catrItemId == idUpdate);

        const temp = [...selectedItems].map((i) =>
          i.catrItemId == idUpdate ? newItemUpdate : i
        );
        setSubTotal(totalPrice(temp));
        setSelectedItems(temp);
      }
    };

    fetchCarts();

    SuccessAlert({
      text: "Update cart item success!",
    });
  };

  const handleAddress = async (e) => {
    const a = addresses.find((o) => o.addressId == e.target.value);

    const feeS = await feeShip(
      getIdAddress(a.district),
      getIdAddress(a.ward + "")
    );

    setAddress(Number(e.target.value));

    setAddressTitle(
      `${getNameAddress(a?.province)}, ${getNameAddress(
        a.district
      )}, ${getNameAddress(a?.ward)}, ${a?.detailAddress}`
    );
    setFee(feeS);
  };

  //Tính phí vận chuyển
  const feeShip = useCallback(async (districtId, wardCode) => {
    const [err, resp] = await ghnExecAPI({
      url: "shiip/public-api/v2/shipping-order/fee",
      data: {
        service_type_id: 2,
        from_district_id: 3317,
        to_district_id: districtId,
        to_ward_code: wardCode,
        height: 20,
        length: 30,
        weight: 3000,
        width: 40,
        insurance_value: 0,
        coupon: null,
        items: [
          {
            name: "TEST1",
            quantity: 1,
            height: 200,
            weight: 1000,
            length: 200,
            width: 200,
          },
        ],
      },
    });

    if (resp) {
      return resp.data.data.total;
    }

    return null;
  }, []);

  //
  const handleNote = (event) => {
    setNote(event.target.value);
  };

  // Hàm giảm số lượng
  const handleUpdateQuantiy = async (id, quantity) => {
    const [error, data] = await stfExecAPI({
      method: "post",
      url: "api/user/cart/update",
      data: {
        cartItemId: id,
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
    }

    if (data) {
      const fetchCarts = async () => {
        const [error, data] = await stfExecAPI({
          url: "api/user/cart/all",
        });

        if (data) {
          const temp = [...selectedItems].map((s) => {
            if (s.catrItemId === id) {
              return { ...s, quantity: quantity };
            } else {
              return s;
            }
          });
          console.log(temp);
          setCarts(data.data);
          setSelectedItems(temp);
          setSubTotal(totalPrice(temp));
        }
      };

      fetchCarts();
    }
  };

  //Đổ dữ liệu địa chỉ của user
  useEffect(() => {
    const fetchDataAddress = async () => {
      const [error, data] = await stfExecAPI({
        url: "api/user/address/get-all",
      });

      if (data) {
        const a = data?.data[0];

        const feeS = await feeShip(
          getIdAddress(a.district),
          getIdAddress(a.ward + "")
        );

        setAddresses([...data?.data]);
        setAddress(a.addressId);
        setAddressTitle(
          `${getNameAddress(a.province)}, ${getNameAddress(
            a.district
          )}, ${getNameAddress(a.ward)}, ${a.detailAddress}`
        );
        setFee(feeS);
      }
    };

    fetchDataAddress();
  }, []);

  // Hàm xử lý khi checkbox tổng được click
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    if (carts.length <= 0) {
      setSelectedItems([]);
      setVersionID([]);
      setSubTotal(0);
      return;
    }

    // Nếu select all được chọn, tất cả sản phẩm sẽ được chọn, ngược lại thì bỏ chọn
    if (newSelectAll) {
      setSelectedItems([...carts]);
      setVersionID([...carts]);
      setSubTotal(totalPrice(carts));
    } else {
      setSelectedItems([]);
      setVersionID([]);
      setSubTotal(0);
    }
  };

  // Hàm xử lý khi checkbox con được click
  const handleSelectItem = (c) => {
    let newSelectedItems = [...selectedItems];

    if (
      newSelectedItems.find((o) => o.catrItemId === c.catrItemId) !== undefined
    ) {
      newSelectedItems = newSelectedItems.filter(
        (item) => item.catrItemId !== c.catrItemId
      ); // Bỏ chọn
    } else {
      newSelectedItems.push(c); // Chọn thêm
    }

    setSelectedItems(newSelectedItems);
    setVersionID(newSelectedItems); // Cập nhật VersionID
    setSubTotal(totalPrice([...newSelectedItems]));
    // Nếu tất cả checkbox con được chọn thì checkbox tổng sẽ tự động được chọn
    if (newSelectedItems?.length === carts?.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  };

  useEffect(() => {
    const fetchCouponRead = async () => {
      const [error, data] = await stfExecAPI({
        url: `api/user/coupon/${iputEnter}`,
      });

      if (error) {
        setCouponRead("");
        return;
      }

      const c = data.data;

      const pri = c.percent
        ? subTotal * getPercentage(parseInt(c.percent))
        : c.price;
      setCouponRead(`${c.couponCode} - Giảm ${formatCurrencyVND(pri)}`);
    };

    fetchCouponRead();
  }, [subTotal]);

  //Áp dụng coupon
  const handleApplyCoupon = async () => {
    const [error, data] = await stfExecAPI({
      url: `api/user/coupon/${iputEnter}`,
    });

    if (error) {
      setCouponRead("");

      DangerAlert({
        text: "Coupon not found!",
      });
      return;
    }
    const c = data.data;

    const pri = c.percent
      ? subTotal * getPercentage(parseInt(c.percent))
      : c.price;

    setCouponRead(`${c.couponCode} - Giảm ${formatCurrencyVND(pri)}`);

    SuccessAlert({
      text: "Apply coupon success",
    });
  };

  //Tính tổng tiền
  useEffect(() => {
    const fetchCouponRead = async () => {
      const [error, data] = await stfExecAPI({
        url: `api/user/coupon/${iputEnter}`,
      });

      if (error) {
        const tt = subTotal + fee;
        setTotal(tt);
        return;
      }

      const c = data.data;

      const pri = c.percent
        ? subTotal * getPercentage(parseInt(c.percent))
        : c.price;

      const tt = subTotal + fee - pri;
      setTotal(tt);
    };

    fetchCouponRead();
  }, [subTotal, couponRead, fee]);

  const style = {
    m: { marginTop: "40px" },
  };
  return (
    <div style={style.m}>
      {/* <!-- Shoping Cart --> */}
      <div className="bg0 p-t-75 p-b-64">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 col-xl-7 m-lr-auto m-b-50">
              <div className="m-l-25 m-r--38 m-lr-0-xl">
                <div className="wrap-table-shopping-cart">
                  <table className="table-shopping-cart">
                    <thead>
                      <tr className="table_head">
                        <th className="p-4">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectAll}
                            onChange={handleSelectAll} // Xử lý khi checkbox tổng được click
                          />
                        </th>
                        <th>Product</th>
                        <th></th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carts &&
                        carts.map((product, index) => (
                          <tr className="table_row" key={product.id}>
                            <td className="p-4 pt-0">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={
                                  selectedItems.filter(
                                    (o) => o.catrItemId === product.catrItemId
                                  ).length > 0
                                }
                                onChange={() => handleSelectItem(product)} // Xử lý khi checkbox con được click
                              />
                            </td>
                            <td>
                              <div className="how-itemcart1">
                                {/* Gán cứng hình đặng có ảnh coi chơi nữa đổ ra lại product.image */}
                                <img
                                  src={
                                    "http://localhost:8080/images/1726151501124.jpg"
                                  }
                                  alt={"No"}
                                />
                              </div>
                            </td>
                            <td>
                              <h6>{product.productName}</h6>
                              <button
                                type="button"
                                className="  stext-106 cl6 bor4 pointer hov-btn3 trans-04 p-2 rounded-0"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                                onClick={() => {
                                  handleClickEditVersion(
                                    product.catrItemId,
                                    product.versionId,
                                    product.productDetail.versions
                                  );
                                }}
                              >
                                {product.productDetail.versions.find(
                                  (o) => o.id == product.versionId
                                ).versionName +
                                  " - " +
                                  product.attributes
                                    .map((a) => a.value)
                                    .join(" - ")}{" "}
                                (<i className="zmdi zmdi-edit"></i>)
                              </button>
                            </td>
                            <td>{formatCurrencyVND(product.price)}</td>
                            <td>
                              {/* Giả lập số lượng sản phẩm */}
                              <div className="wrap-num-product flex-w">
                                <div
                                  onClick={() => {
                                    handleUpdateQuantiy(
                                      product.catrItemId,
                                      product.quantity - 1
                                    );
                                  }}
                                  className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m"
                                >
                                  <i className="fs-16 zmdi zmdi-minus"></i>
                                </div>
                                <input
                                  className="mtext-104 cl3 txt-center num-product"
                                  type="number"
                                  value={product.quantity}
                                  min="1" // Chỉ cho phép giá trị >= 1
                                  step="1" // Bước nhảy của số là 1 (không cho phép số thập phân)
                                  onKeyDown={(e) => {
                                    if (
                                      !/[0-9]/.test(e.key) && // Chỉ cho phép nhập số
                                      e.key !== "Backspace" && // Cho phép xóa ký tự
                                      e.key !== "ArrowLeft" && // Cho phép di chuyển con trỏ
                                      e.key !== "ArrowRight" && // Cho phép di chuyển con trỏ
                                      e.key !== "Delete" && // Cho phép sử dụng phím Delete
                                      e.key !== "Tab" // Cho phép sử dụng phím Tab để chuyển đổi focus
                                    ) {
                                      e.preventDefault(); // Chặn phím không hợp lệ
                                    }
                                  }}
                                  onChange={(e) => {
                                    setCarts([
                                      ...carts.map((c) => {
                                        if (
                                          c.catrItemId === product.catrItemId
                                        ) {
                                          return {
                                            ...c,
                                            quantity: e.target.value,
                                          };
                                        } else {
                                          return c;
                                        }
                                      }),
                                    ]);
                                  }}
                                  onBlur={async (e) => {
                                    let value = Math.max(
                                      1,
                                      parseInt(e.target.value) || 1
                                    ); // Chặn số âm và giá trị 0

                                    if (value === 1) {
                                      const [error, data] = await stfExecAPI({
                                        url: "api/user/cart/all",
                                      });

                                      value = data.data?.find(
                                        (o) =>
                                          o.catrItemId === product.catrItemId
                                      )?.quantity;

                                      setCarts(
                                        carts.map((i) => {
                                          if (
                                            i.catrItemId === product.catrItemId
                                          ) {
                                            return { ...i, quantity: value };
                                          } else {
                                            return i;
                                          }
                                        })
                                      );

                                      const temp = [...selectedItems].map(
                                        (s) => {
                                          if (
                                            s.catrItemId === product.catrItemId
                                          ) {
                                            return { ...s, quantity: value };
                                          } else {
                                            return s;
                                          }
                                        }
                                      );
                                      setSelectedItems(temp);
                                      setSubTotal(totalPrice(temp));
                                      return;
                                    }

                                    handleUpdateQuantiy(
                                      product.catrItemId,
                                      value
                                    );
                                  }}
                                />
                                <div
                                  onClick={() => {
                                    handleUpdateQuantiy(
                                      product.catrItemId,
                                      product.quantity + 1
                                    );
                                  }}
                                  className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m"
                                >
                                  <i className="fs-16 zmdi zmdi-plus"></i>
                                </div>
                              </div>
                            </td>
                            <td>
                              {formatCurrencyVND(
                                product.price * product.quantity
                              )}
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-danger rounded-0"
                                onClick={() => {
                                  handleDeleteCartItem(product.catrItemId);
                                }}
                              >
                                <i className="zmdi zmdi-delete"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex align-items-center flex-sb-m bor15 p-t-18 p-b-15 p-lr-40 p-lr-15-sm">
                  <div className="input-group">
                    <div>
                      <select
                        className="flex-c-m stext-101 cl2 size-119 bg8 bor13 p-lr-15 trans-04 pointer m-tb-5 form-select rounded-start-5"
                        onChange={handleCoupon}
                        value={Coupon}
                      >
                        <option value="-1" selected>
                          Select a coupon
                        </option>

                        {coupons &&
                          coupons.map((c) => {
                            return (
                              <option value={c.id}>{`${c.couponCode} - Giảm ${
                                c.percent ? c.percent + " %" : c.price + " đ"
                              } - Còn ${getEndDate(c.endDate)}`}</option>
                            );
                          })}
                      </select>
                    </div>
                    <input
                      type="text"
                      className="form-control stext-104 cl2 plh4 size-117 bor13 p-lr-20 m-r-10 m-tb-5 rounded-end-5"
                      aria-label="Text input with dropdown button"
                      onChange={handleInputCoupon}
                      value={iputEnter}
                    />
                  </div>
                  <div
                    onClick={handleApplyCoupon}
                    className="flex-c-m stext-101 cl2 size-119 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer m-tb-10"
                  >
                    Apply coupon
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-10 col-lg-7 col-xl-5 m-lr-auto m-b-50">
              <div className="bor10 p-lr-40 p-t-30 p-b-40 m-l-63 m-r-40 m-lr-0-xl p-lr-15-sm">
                <h4 className="mtext-109 cl2 p-b-30">Cart Totals</h4>

                <div className="d-flex bor12 p-3">
                  <span className="stext-110 cl2">Subtotal:</span>

                  <div className="w-100 ">
                    <div className="text-end">
                      <span className="mtext-110 cl2 me-2">
                        {formatCurrencyVND(subTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bor12 p-t-15 w-full">
                  {/* Address Section */}
                  <div className="w-full-ssm h-100  p-3">
                    <div className="mb-3">
                      <span className="stext-110 cl2">Address*:</span>
                      <div className="mt-2">
                        <select
                          className="w-100 border border-1 p-2 form-select stext-111"
                          aria-label="Default select example"
                          onChange={handleAddress}
                        >
                          {addresses &&
                            addresses.map((item) => {
                              return (
                                <option
                                  selected={item.addressId === Number(address)}
                                  value={item.addressId}
                                >
                                  {`${getNameAddress(
                                    item.province
                                  )}, ${getNameAddress(
                                    item.district
                                  )}, ${getNameAddress(item.ward)}, ${
                                    item.detailAddress
                                  }`}
                                </option>
                              );
                            })}
                        </select>

                        <div className=" w-full d-flex justify-content-between mt-3">
                          <span className="stext-111 cl2">Delivery fee:</span>
                          <span className="stext-110 cl2">
                            {fee ? formatCurrencyVND(fee) : ""}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full">
                      <li className="rounded-0 py-3 px-2 mb-2 border-top">
                        <div className="me-3 row">
                          {/* <i className="zmdi zmdi-label me-2"></i> */}
                          <div className="col-12 d-flex flex-column">
                            <span
                              className="text-black-50"
                              style={{ fontSize: "0.9rem" }}
                            >
                              Địa chỉ:
                              {` ${addressTitle}`}
                            </span>
                          </div>
                        </div>
                      </li>
                    </div>

                    {/* Coupon Section */}
                    <div className="mb-3">
                      <span className="stext-110 cl2">Coupon (Read Only):</span>
                      <div className="bor8 bg0 mt-2">
                        <input
                          className="rounded-0 stext-110 cl8 plh3 size-111 p-lr-15 w-100 text-danger text-end"
                          type="text"
                          name="state"
                          value={couponRead}
                          readOnly
                        />
                      </div>
                    </div>

                    <div>
                      <span className="stext-110 cl2">Payment method:</span>

                      <div className="mt-3 d-flex">
                        <div className="form-check me-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault1"
                            checked={pay}
                            onChange={(e) => {
                              setPay(e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault1"
                          >
                            Cash on Delivery
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault2"
                            checked={!pay}
                            onChange={(e) => {
                              setPay(!e.target.checked);
                            }}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault2"
                          >
                            VNPay
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-w flex-t p-t-27 p-b-33">
                  <div className="size-208 ps-3">
                    <span className="mtext-101 cl2">Total:</span>
                  </div>

                  <div className="size-209 p-t-1 text-end pe-3">
                    <span className="mtext-110 cl2">
                      {formatCurrencyVND(total)}
                    </span>
                  </div>
                </div>

                <button
                  className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer"
                  onClick={handleProceedToCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Modal sửa phiên bản --> */}
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header pb-1 pt-2">
                <h1
                  className="modal-title  stext-101 cl5 size-103 d-flex align-items-center"
                  id="exampleModalLabel"
                >
                  Edit Version
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div>
                  <div className="form-group mb-3">
                    <div className="row">
                      <div className="col-md-12 mb-2">
                        <select
                          className="form-select rounded-0"
                          aria-label="Select Color"
                          onChange={(e) => {
                            setVersion(e.target.value);
                          }}
                          value={version}
                        >
                          {versions &&
                            versions.map((item) => {
                              return (
                                <option
                                  key={item.id}
                                  selected={version === item.id}
                                  className="stext-110"
                                  value={item.id}
                                >
                                  {`${item.versionName} - ` +
                                    item.attributes
                                      .map((i) => {
                                        return i.value;
                                      })
                                      .join(" - ") +
                                    ` - Giá ${formatCurrencyVND(item.price)}`}
                                </option>
                              );
                            })}
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleUpdateVersionCart}
                    className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ShopingCart;

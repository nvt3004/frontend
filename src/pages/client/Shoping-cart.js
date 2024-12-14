import React, { useCallback, useEffect, useMemo, useState } from "react";
import DangerAlert from "../../components/client/sweetalert/DangerAlert";
import SuccessAlert from "../../components/client/sweetalert/SuccessAlert";
import ConfirmAlert from "../../components/client/sweetalert/ConfirmAlert";
import InfoAlert from "../../components/client/sweetalert/InfoAlert";
import { stfExecAPI, ghnExecAPI } from "../../stf/common";
import AttributeItem from "../../components/client/AttributeItem/AttributeItem";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import moment from "moment";

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

function getNameAddress(nameId) {
  return nameId?.substring(nameId.indexOf(" "), nameId.length).trim();
}

function getIdAddress(name) {
  return name?.substring(0, name.indexOf(" ")).trim();
}

function formatCurrencyVND(amount) {
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function getPercentage(number) {
  const total = 100;
  return number / total;
}

function getRowCelCick(attributes = [], item) {
  for (let i = 0; i < attributes.length; i++) {
    const key = attributes[i].key;

    for (let j = 0; j < attributes[i].values.length; j++) {
      const val = attributes[i].values[j];

      if (key?.toLowerCase() == item?.key?.toLowerCase()) {
        if (val?.toLowerCase() == item?.value?.toLowerCase()) {
          return [i, j];
        }
      }
    }

    return [0, 0];
  }
}

const ShopingCart = () => {
  const navigate = useNavigate();
  const [carts, setCarts] = useState([]);
  console.log("@carts: ", carts);
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

  const [err, setErr] = useState();
  const [itemCartUpdate, setItemCartUpdate] = useState();

  //Xử lý thay đổi phiên bản sản phẩm trong giỏ hàng
  const findAllValueInAttributes = useCallback(
    (atbs, products, keyToEetrieve) => {
      const atbsTemp = [...atbs];

      if (atbsTemp.length >= 2) {
        atbsTemp.splice(-1, 1);
      }

      const versionTemps = { ...products }.productDetail.versions.filter(
        (item, index) => {
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
        }
      );

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
      const arrs = [...products.productDetail.attributes].map((a) => {
        return a.values;
      });
      const [row, cel] = rowCelClick;
      const valueReduces = [
        { key: keySelectedWhenClick, value: arrs[row][cel] },
      ];
      let atbProducts = JSON.parse(
        JSON.stringify(products.productDetail.attributes)
      );

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

  const [pd, setPd] = useState();
  const [attriTest, setAttriTest] = useState([
    // {
    //   key: "size",
    //   value: "S",
    // },
    // {
    //   key: "color",
    //   value: "Blue",
    // },
    // {
    //   key: "cl",
    //   value: "Min",
    // },
  ]);

  const [product, setProduct] = useState([]);
  console.log("Render", product);

  const handleClickItemAttribute = ({ key, value, rowCel }) => {
    const [row, cel] = rowCel;
    const tem = attriTest.map((o) => {
      const isEqual = o?.key?.toLowerCase() == key?.toLowerCase();
      return isEqual ? { ...o, value: value } : o;
    });

    setAttriTest(tem);
    setProduct(partitionProduct(pd, tem, [row, cel], key));
    console.log(8666, pd);
  };

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
  console.log("@seletedItem: ", selectedItems);

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
      toast.error(`${error?.response?.data?.message}`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    const temp = [...selectedItems].filter((o) => o.catrItemId !== id);

    setSelectedItems(temp);
    setSubTotal(totalPrice(temp));

    setCarts(carts.filter((c) => c.catrItemId !== id));

    toast.success("Delete cart item success!", {
      className: "toast-message",
      position: "top-right",
      autoClose: 5000,
    });
  };

  //Thanh toán
  const handleProceedToCheckout = async () => {
    if (selectedItems.length <= 0) {
      toast.info("Please select product before checkout!", {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (!address) {
      toast.info("Please select address before checkout!", {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    //Đổ carts
    const fetchCarts = async () => {
      const [error, data] = await stfExecAPI({
        url: "api/user/cart/all",
      });

      if (data) {
        setCarts(data.data);
      }
    };

    if (couponRead.trim() !== "") {
      const [error, data] = await stfExecAPI({
        url: `api/user/coupon?code=${iputEnter}`,
      });

      if (error) {
        toast.info("Coupon not found!", {
          className: "toast-message",
          position: "top-right",
          autoClose: 5000,
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

    console.log("@ty", {
      address: addressTitle,
      couponCode: iputEnter || null,
      creatorIsAdmin: false,
      ["fee"]: feeShip,
      statusId: 1,
      paymentMethodId: 2,
      orderDetails: detail,
    });
    if (pay) {
      const [error, data] = await stfExecAPI({
        method: "post",
        url: `api/user/cart/checkout`,
        data: {
          address: addressTitle,
          couponCode: iputEnter || null,
          creatorIsAdmin: false,
          fee,
          statusId: 1,
          paymentMethodId: 2,
          orderDetails: detail,
        },
      });

      if (error) {
        fetchCarts();

        setSubTotal(0);
        setTotal(0);
        setCouponRead("");
        setIputEnter("");
        setSelectAll(false);
        setSelectedItems([]);

        toast.info(`${error?.response?.data?.message}`, {
          className: "toast-message",
          position: "top-right",
          autoClose: 5000,
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
      fetchCarts();

      setSubTotal(0);
      setTotal(0);
      setCouponRead("");
      setIputEnter("");

      toast.success("Checkout success!", {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
    } else {
      const [error, data] = await stfExecAPI({
        method: "post",
        url: `api/vnp/create-payment`,
        data: {
          address: addressTitle,
          couponCode: iputEnter || null,
          creatorIsAdmin: false,
          fee,
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
        fetchCarts();

        setSubTotal(0);
        setTotal(0);
        setCouponRead("");
        setIputEnter("");
        setSelectAll(false);
        setSelectedItems([]);

        toast.info(`${error?.response?.data?.message}`, {
          className: "toast-message",
          position: "top-right",
          autoClose: 5000,
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

  //Cập nhật version trong giỏ hàng
  const handleUpdateVersionCart = async ({ idItem, idVersion }) => {
    const [error, data] = await stfExecAPI({
      method: "put",
      url: "api/user/cart/update-item",
      data: {
        cartItemId: idItem,
        versionId: idVersion,
      },
    });

    if (error) {
      toast.info(`${error?.response?.data?.message}` || "Server error", {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    const fetchCarts = async () => {
      const [error, data] = await stfExecAPI({
        url: "api/user/cart/all",
      });

      if (data) {
        setCarts(data.data);
        const newItemUpdate = data?.data.find((o) => o.catrItemId == idItem);

        const temp = [...selectedItems].map((i) =>
          i?.catrItemId == idItem ? newItemUpdate : i
        );
        setSubTotal(totalPrice(temp));
        setSelectedItems(temp);
      }
    };

    fetchCarts();

    toast.success("Update cart item success!", {
      className: "toast-message",
      position: "top-right",
      autoClose: 5000,
    });
  };

  const handleAddress = async (e) => {
    if (e.target.value === "") {
      navigate("/account"); // Điều hướng tới trang Add new address
    }
    const a = addresses.find((o) => o?.addressId == e.target.value);

    const feeS = await feeShip(
      getIdAddress(a?.district),
      getIdAddress(a?.ward + "")
    );

    setAddress(Number(e.target.value));

    setAddressTitle(
      `${getNameAddress(a?.province)}, ${getNameAddress(
        a?.district
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

  // Hàm giảm số lượng
  const handleUpdateQuantiy = async (id, quantity) => {
    const [error, data] = await stfExecAPI({
      method: "put",
      url: "api/user/cart/update",
      data: {
        cartItemId: id,
        quantity: quantity,
      },
    });

    //Đổ lại giỏ hàng
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
        setCarts(data.data);
        setSelectedItems(temp);
        setSubTotal(totalPrice(temp));
      }
    };

    if (error) {
      //Nếu là vượt quá số lượng tồn kho thì cập nhật số lượng tồn kho vào giỏ hàng
      if (error?.response?.data?.code === 999) {
        fetchCarts();

        setSubTotal(0);
        setTotal(0);
        setCouponRead("");
        setIputEnter("");
        setSelectAll(false);
        setSelectedItems([]);
      }

      toast.info(`${error?.response?.data?.message}` || "Server error", {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (data) {
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
          getIdAddress(a?.district),
          getIdAddress(a?.ward + "")
        );

        setAddresses([...data?.data]);
        setAddress(a?.addressId);
        setAddressTitle(
          `${getNameAddress(a?.province)}, ${getNameAddress(
            a?.district
          )}, ${getNameAddress(a?.ward)}, ${a?.detailAddress}`
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
      const tempCart = carts.filter(
        (c) => c.statusVersion && c.stockQuantity > 0
      );
      setSelectedItems(tempCart);
      setVersionID(tempCart);
      setSubTotal(totalPrice(tempCart));
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
        url: `api/user/coupon?code=${iputEnter}`,
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
      url: `api/user/coupon?code=${iputEnter}`,
    });

    if (error) {
      setCouponRead("");

      toast.info("Coupon not found!", {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }
    const c = data.data;

    const pri = c.percent
      ? subTotal * getPercentage(parseInt(c.percent))
      : c.price;

    setCouponRead(`${c.couponCode} - Giảm ${formatCurrencyVND(pri)}`);

    toast.success("Apply coupon success!", {
      className: "toast-message",
      position: "top-right",
      autoClose: 5000,
    });
  };

  //Tính tổng tiền
  useEffect(() => {
    const fetchCouponRead = async () => {
      const [error, data] = await stfExecAPI({
        url: `api/user/coupon?code=${iputEnter}`,
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

  const handleClickSaveUpdateVersion = async (product) => {
    const length = product.length;
    let numberReduce = 0;
    const data = product.map((i) => {
      const val = i.values.find((o) => o.active && !o.disible)?.val;
      return { key: i.key, value: val || "" };
    });

    product.forEach((p) => {
      p.values.forEach((vl) => {
        if (vl.active && !vl.disible) {
          numberReduce += 1;
        }
      });
    });

    if (length !== numberReduce) {
      setErr("Please select full attributes!");
    } else {
      setErr("");
      console.log(4234, itemCartUpdate);

      for (let i = 0; i < itemCartUpdate?.versions.length; i++) {
        let count = 0;
        let item = itemCartUpdate.versions[i];

        for (let j = 0; j < item.attributes.length; j++) {
          let atb = item.attributes[j];
          const temp = data.find(
            (d) => d?.key?.toLowerCase() == atb?.key?.toLowerCase()
          );

          if (temp && temp?.value == atb.value) {
            count += 1;
          }
        }

        if (item.attributes.length == count) {
          // Cập nhật phiên bản sản phẩm trong giỏ hàng
          await handleUpdateVersionCart({
            idItem: itemCartUpdate.cartItemId,
            idVersion: item.id,
          });
        }
      }
    }
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
                        <th>Sản phẩm</th>
                        <th></th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Tổng</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carts &&
                        carts.map((product, index) => (
                          <tr
                            className="table_row"
                            key={product.id}
                            // style={!product.statusVersion || product.stockQuantity<=0? {
                            //   backgroundColor: "#fafafa",
                            //   opacity: 0.5,
                            //   pointerEvents: "none",
                            //   cursor: "not-allowed",
                            // }: {}}
                          >
                            <td className="p-4 pt-0">
                              {product.statusVersion &&
                              product.stockQuantity > 0 ? (
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
                              ) : (
                                ""
                              )}
                            </td>
                            <td>
                              <div className="how-itemcart1">
                                {/* Gán cứng hình đặng có ảnh coi chơi nữa đổ ra lại product.image */}
                                <img src={product.image} alt={"No"} />
                              </div>
                            </td>
                            <td>
                              <h6 className="mb-2">{product.productName}</h6>
                              <button
                                style={
                                  !product.statusVersion
                                    ? {
                                        backgroundColor: "#fafafa",
                                        opacity: 0.5,
                                        pointerEvents: "none",
                                        cursor: "not-allowed",
                                      }
                                    : {}
                                }
                                type="button"
                                className="text-ellipsis mb-2 stext-106 cl6 bor4 pointer hov-btn3 trans-04 p-2 rounded-0"
                                data-bs-toggle="modal"
                                data-bs-target="#staticBackdrop"
                                onClick={() => {
                                  setItemCartUpdate({
                                    cartItemId: product.catrItemId,
                                    versions: [
                                      ...product.productDetail.versions,
                                    ],
                                  });
                                  setPd(product);
                                  setProduct(
                                    partitionProduct(
                                      product,
                                      product.attributes,
                                      getRowCelCick(
                                        product.productDetail.attributes,
                                        product.attributes[0]
                                      ),
                                      product.attributes[0].key
                                    )
                                  );
                                  setAttriTest(product.attributes);
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

                              <div>
                                <span className="mx-2 text-danger">
                                  {!product.statusVersion
                                    ? "Discontinued"
                                    : product.stockQuantity <= 0
                                    ? "Sold out"
                                    : ""}
                                </span>
                              </div>
                            </td>
                            <td>{formatCurrencyVND(product.price)}</td>
                            <td>
                              {/* Giả lập số lượng sản phẩm */}
                              <div
                                className="wrap-num-product flex-w"
                                style={
                                  !product.statusVersion ||
                                  product.stockQuantity <= 0
                                    ? {
                                        backgroundColor: "#fafafa",
                                        opacity: 0.5,
                                        pointerEvents: "none",
                                        cursor: "not-allowed",
                                      }
                                    : {}
                                }
                              >
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

                                    // if (value === 1) {
                                    //   const [error, data] = await stfExecAPI({
                                    //     url: "api/user/cart/all",
                                    //   });

                                    //   value = data.data?.find(
                                    //     (o) =>
                                    //       o.catrItemId === product.catrItemId
                                    //   )?.quantity;

                                    //   setCarts(
                                    //     carts.map((i) => {
                                    //       if (
                                    //         i.catrItemId === product.catrItemId
                                    //       ) {
                                    //         return { ...i, quantity: value };
                                    //       } else {
                                    //         return i;
                                    //       }
                                    //     })
                                    //   );

                                    //   const temp = [...selectedItems].map(
                                    //     (s) => {
                                    //       if (
                                    //         s.catrItemId === product.catrItemId
                                    //       ) {
                                    //         return { ...s, quantity: value };
                                    //       } else {
                                    //         return s;
                                    //       }
                                    //     }
                                    //   );
                                    //   setSelectedItems(temp);
                                    //   setSubTotal(totalPrice(temp));
                                    //   return;
                                    // }

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
                  <div className="w-100 me-2">
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
                              c.percent
                                ? c.percent + " %"
                                : formatCurrencyVND(c.price)
                            } - Còn ${getEndDate(c.endDate)}`}</option>
                          );
                        })}
                    </select>
                  </div>
                  <input
                    style={{ display: "none" }}
                    type="hide"
                    aria-label="Text input with dropdown button"
                    onChange={handleInputCoupon}
                    value={iputEnter}
                  />

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
                <h4 className="mtext-109 cl2 p-b-30">Tổng giỏ hàng</h4>

                <div className="d-flex bor12 p-3">
                  <span className="stext-110 cl2">Tổng:</span>

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
                      <span className="stext-110 cl2">Địa chỉ:</span>
                      <div className="mt-2">
                        <select
                          className="pe-5 text-ellipsis w-100 border border-1 p-2 form-select stext-111"
                          aria-label="Default select example"
                          onChange={handleAddress}
                        >
                          {" "}
                          <option value="">
                            <Link
                              to="/account"
                              className="text-decoration-none"
                            >
                              Add new address
                            </Link>
                          </option>
                          {addresses &&
                            addresses.map((item) => {
                              return (
                                <option
                                  selected={item?.addressId === Number(address)}
                                  value={item?.addressId}
                                >
                                  {`${getNameAddress(
                                    item?.province
                                  )}, ${getNameAddress(
                                    item?.district
                                  )}, ${getNameAddress(item.ward)}, ${
                                    item?.detailAddress
                                  }`}
                                </option>
                              );
                            })}
                        </select>

                        <div className=" w-full d-flex justify-content-between mt-3">
                          <span className="stext-111 cl2">Phí vận chuyển:</span>
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
                      <span className="stext-110 cl2">
                        Mã giảm giá (Chỉ đọc):
                      </span>
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
                      <span className="stext-110 cl2">
                        Phương thức thành toán:
                      </span>

                      <div className="mt-3 d-flex">
                        <div className="d-flex me-2">
                          <input
                            className="form-check-input  me-2"
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
                            style={{ display: "inline" }}
                          >
                            Khi nhận hàng
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

                <div className="d-flex justify-content-between mb-3 mt-3">
                  <div className="ps-3">
                    <span className="mtext-101 cl2">Tổng cộng:</span>
                  </div>

                  <div className="p-t-1 text-end pe-3">
                    <span className="mtext-110 cl2">
                      {formatCurrencyVND(total < 0 ? 0 : total)}
                    </span>
                  </div>
                </div>

                <button
                  className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer"
                  onClick={handleProceedToCheckout}
                >
                  Thanh toán
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
                  Chọn sản phẩm
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

      {/* Modal đổi sản phẩm trong giỏ */}
      <div
        className="modal fade"
        id="staticBackdrop"
        tabindex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content rounded-0">
            <div className="modal-header py-0">
              <h1
                className="modal-title  stext-101 cl5 size-103 d-flex align-items-center"
                id="exampleModalLabel"
              >
                Chọn sản phẩm
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <AttributeItem
              pd={product}
              onClick={handleClickItemAttribute}
              clickSave={handleClickSaveUpdateVersion}
              message={err}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ShopingCart;

//Thêm bảng có id của quyền add product,

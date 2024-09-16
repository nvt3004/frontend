import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ShopingCart = () => {
  const Products = [
    {
      id: 1,
      name: "Fresh Strawberries",
      img: "images/item-cart-04.jpg",
      price: 36.0,
    },
    {
      id: 2,
      name: "Lightweight Jacket",
      img: "images/item-cart-05.jpg",
      price: 16.0,
    },
  ];

  //ví dụ
  const [ProductID, setProductID] = useState(1);
  const [VersionID, setVersionID] = useState([]);
  //
  const [Coupon, setCoupon] = useState("");
  //
  const [Address, setAddress] = useState("");
  const [Note, setNote] = useState("");
  //==========================================
  // State để lưu trữ trạng thái của checkbox tổng
  const [selectAll, setSelectAll] = useState(false);

  // State để lưu trữ trạng thái của từng checkbox con, và VersionID
  const [selectedItems, setSelectedItems] = useState([]);

  const handleProceedToCheckout = async () => {
    if (!VersionID) return;

    const formData = new FormData();
    formData.append("ProductID", ProductID);
    formData.append("VersionID", VersionID);
    //
    formData.append("Coupon", Coupon);
    //
    formData.append("Address", Address);
    formData.append("Note", Note);

    //xem dữ liệu
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
  };

  const handleCoupon = (event) => {
    setCoupon(event.target.value);
  };
  //
  const navigate = useNavigate();
  const handleAddress = (e) => {
    setAddress(e.target.value);
    if (e.target.value === "add-new") {
      // Điều hướng đến trang thêm địa chỉ mới hoặc mở modal
      navigate("/account");
    }
  };
  //
  const handleNote = (event) => {
    setNote(event.target.value);
  };

  // Hàm giảm số lượng
  const handleDecrease = (Id) => {
    //call api giam so luong
  };

  // Hàm tăng số lượng
  const handleIncrease = (Id) => {
    //call api giam so luong
  };

  // Hàm xử lý khi người dùng nhập số lượng trực tiếp
  const handleChange = (event, Id) => {
    // cái này là productID nếu có sd thì set dô
    setProductID("1");
    //Id la id cua productversion
    //event.target.value laf du lieu
  };

  // Danh sách sản phẩm với ID và các thông tin cần thiết
  const products = [
    { id: 1, name: "Fresh Strawberries", price: 36.0 },
    { id: 2, name: "Lightweight Jacket", price: 16.0 },
  ];

  // Hàm xử lý khi checkbox tổng được click
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    // Nếu select all được chọn, tất cả sản phẩm sẽ được chọn, ngược lại thì bỏ chọn
    if (newSelectAll) {
      setSelectedItems(products.map((product) => product.id));
      setVersionID(products.map((product) => product.id));
    } else {
      setSelectedItems([]);
      setVersionID([]);
    }
  };

  // Hàm xử lý khi checkbox con được click
  const handleSelectItem = (id) => {
    let newSelectedItems = [...selectedItems];

    if (newSelectedItems.includes(id)) {
      newSelectedItems = newSelectedItems.filter((item) => item !== id); // Bỏ chọn
    } else {
      newSelectedItems.push(id); // Chọn thêm
    }

    setSelectedItems(newSelectedItems);
    setVersionID(newSelectedItems); // Cập nhật VersionID

    // Nếu tất cả checkbox con được chọn thì checkbox tổng sẽ tự động được chọn
    if (newSelectedItems.length === products.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  };

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
                      {Products.map((product) => (
                        <tr className="table_row" key={product.id}>
                          <td className="p-4 pt-0">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={selectedItems.includes(product.id)}
                              onChange={() => handleSelectItem(product.id)} // Xử lý khi checkbox con được click
                            />
                          </td>
                          <td>
                            <div className="how-itemcart1">
                              <img src={product.img} alt={product.name} />
                            </div>
                          </td>
                          <td>
                            <h6>{product.name}</h6>
                          </td>
                          <td>${product.price}</td>
                          <td>
                            {/* Giả lập số lượng sản phẩm */}
                            <div className="wrap-num-product flex-w">
                              <div className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m">
                                <i className="fs-16 zmdi zmdi-minus"></i>
                              </div>
                              <input
                                className="mtext-104 cl3 txt-center num-product"
                                type="number"
                                value={1} // Giả lập giá trị
                                onChange={() => {}} // Sử dụng hàm xử lý riêng nếu cần thay đổi số lượng
                              />
                              <div className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m">
                                <i className="fs-16 zmdi zmdi-plus"></i>
                              </div>
                            </div>
                          </td>
                          <td>${product.price}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-danger rounded-0"
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
                        <option value="" disabled selected>
                          Select a coupon...
                        </option>
                        <option value="COUPON10">COUPON10 - 10% Off</option>
                        <option value="COUPON20">COUPON20 - 20% Off</option>
                        <option value="COUPON30">COUPON30 - 30% Off</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      className="form-control stext-104 cl2 plh4 size-117 bor13 p-lr-20 m-r-10 m-tb-5 rounded-end-5"
                      aria-label="Text input with dropdown button"
                      onChange={handleCoupon}
                      value={Coupon}
                    />
                  </div>
                  <div className="flex-c-m stext-101 cl2 size-119 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer m-tb-10">
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
                      <span className="mtext-110 cl2 me-2">$79.65</span>
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
                          value={Address}
                        >
                          <option value="" selected>
                            Select a Address...
                          </option>
                          <option value="ninkieu">Ninh Kiều</option>
                          <option value="angiang">An Giang</option>
                          <option value="hcm">TP HCM</option>
                          <option value="add-new" className="font-weight-bold">
                            {" "}
                            ADD NEW ADDRESS
                          </option>{" "}
                          {/* Giá trị đặc biệt để điều hướng */}
                        </select>

                        <div className=" w-full d-flex justify-content-between mt-1">
                          <span className="stext-111 cl2">Delivery fee:</span>
                          <span className="stext-110 cl2">+ $10.65</span>
                        </div>
                      </div>
                    </div>

                    {/* Coupon Section */}
                    <div className="mb-3">
                      <span className="stext-110 cl2">Coupon (Read Only):</span>
                      <div className="bor8 bg0 mt-2">
                        <input
                          className="rounded-0 stext-110 cl8 plh3 size-111 p-lr-15 w-100 text-end"
                          type="text"
                          name="state"
                          value="-10.00 $"
                          readOnly
                        />
                      </div>
                    </div>

                    <div>
                      <span className="stext-110 cl2">Notes:</span>
                      <textarea
                        className="form-control rounded-0 stext-110"
                        rows="5"
                        placeholder="Enter additional information..."
                        onChange={handleNote}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="flex-w flex-t p-t-27 p-b-33">
                  <div className="size-208 ps-3">
                    <span className="mtext-101 cl2">Total:</span>
                  </div>

                  <div className="size-209 p-t-1 text-end pe-3">
                    <span className="mtext-110 cl2">$79.65</span>
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
        {/* <!-- Modal --> */}
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
                      <div className="col-md-6 mb-2">
                        <select
                          className="form-select rounded-0"
                          aria-label="Select Color"
                        >
                          <option className="stext-110" selected>
                            Select Color
                          </option>
                          <option className="stext-110" value="red">
                            Red
                          </option>
                          <option className="stext-110" value="blue">
                            Blue
                          </option>
                          <option className="stext-110" value="green">
                            Green
                          </option>
                        </select>
                      </div>
                      <div className="col-md-6 mb-2">
                        <select
                          className="form-select rounded-0"
                          aria-label="Select Size"
                        >
                          <option className="stext-110" selected>
                            Select Size
                          </option>
                          <option className="stext-110" value="small">
                            Small
                          </option>
                          <option className="stext-110" value="medium">
                            Medium
                          </option>
                          <option className="stext-110" value="large">
                            Large
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer">
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

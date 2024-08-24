import React, { useState } from "react";
import { Link } from "react-router-dom";

const ShopingCart = () => {
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState("");

  const handleSelectCoupon = (event) => {
    setSelectedCoupon(event.target.textContent);
  };
  const handleSelectAll = () => {
    if (!selectAll) {
      setSelectedProductIds(["product1", "product2"]); // Thêm tất cả ID sản phẩm
    } else {
      setSelectedProductIds([]); // Bỏ chọn tất cả
    }
    setSelectAll(!selectAll);
  };

  const handleSelectProduct = (productId) => {
    let newSelectedProductIds;
    if (selectedProductIds.includes(productId)) {
      newSelectedProductIds = selectedProductIds.filter(
        (id) => id !== productId
      );
    } else {
      newSelectedProductIds = [...selectedProductIds, productId];
    }
    setSelectedProductIds(newSelectedProductIds);
    setSelectAll(newSelectedProductIds.length === 2); // Kiểm tra nếu tất cả sản phẩm đều được chọn
  };

  // Khởi tạo state cho số lượng sản phẩm bằng một đối tượng
  const [quantities, setQuantities] = useState({
    product1: 1,
    product2: 1,
  });

  // Hàm giảm số lượng
  const handleDecrease = (productId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]:
        prevQuantities[productId] > 1 ? prevQuantities[productId] - 1 : 1,
    }));
  };

  // Hàm tăng số lượng
  const handleIncrease = (productId) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: prevQuantities[productId] + 1,
    }));
  };

  // Hàm xử lý khi người dùng nhập số lượng trực tiếp
  const handleChange = (event, productId) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: value,
      }));
    }
  };
  const style = {
    m: { marginTop: "40px" },
  };
  return (
    <div style={style.m}>
      {/* <!-- Shoping Cart --> */}
      <form className="bg0 p-t-75 p-b-64">
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
                            onChange={handleSelectAll}
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
                      <tr className="table_row">
                        <td className="p-4 pt-0">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedProductIds.includes("product1")}
                            onChange={() => handleSelectProduct("product1")}
                          />
                        </td>
                        <td>
                          <div className="how-itemcart1">
                            <img
                              src="images/item-cart-04.jpg"
                              alt="Product 1"
                            />
                          </div>
                        </td>
                        <td>Fresh Strawberries</td>
                        <td>$ 36.00</td>
                        <td>
                          <div className="wrap-num-product flex-w ">
                            <div
                              className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m"
                              onClick={() => handleDecrease("product1")}
                            >
                              <i className="fs-16 zmdi zmdi-minus"></i>
                            </div>
                            <input
                              className="mtext-104 cl3 txt-center num-product"
                              type="number"
                              value={quantities["product1"]}
                              onChange={(e) => handleChange(e, "product1")}
                            />
                            <div
                              className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m"
                              onClick={() => handleIncrease("product1")}
                            >
                              <i className="fs-16 zmdi zmdi-plus"></i>
                            </div>
                          </div>
                        </td>
                        <td>$ 36.00</td>
                        <td className="">
                          {" "}
                          <button
                            type="button"
                            class="btn btn-danger rounded-0"
                          >
                            <i class="zmdi zmdi-delete"></i>
                          </button>
                        </td>
                      </tr>
                      <tr className="table_row">
                        <td className="p-4 pt-0">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedProductIds.includes("product2")}
                            onChange={() => handleSelectProduct("product2")}
                          />
                        </td>
                        <td>
                          <div className="how-itemcart1">
                            <img
                              src="images/item-cart-05.jpg"
                              alt="Product 2"
                            />
                          </div>
                        </td>
                        <td>Lightweight Jacket</td>
                        <td>$ 16.00</td>
                        <td>
                          <div className="wrap-num-product flex-w">
                            <div
                              className="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m"
                              onClick={() => handleDecrease("product2")}
                            >
                              <i className="fs-16 zmdi zmdi-minus"></i>
                            </div>
                            <input
                              className="mtext-104 cl3 txt-center num-product"
                              type="number"
                              value={quantities["product2"]}
                              onChange={(e) => handleChange(e, "product2")}
                            />
                            <div
                              className="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m"
                              onClick={() => handleIncrease("product2")}
                            >
                              <i className="fs-16 zmdi zmdi-plus"></i>
                            </div>
                          </div>
                        </td>
                        <td>$ 16.00</td>
                        <td className="">
                          <button
                            type="button"
                            class="btn btn-danger rounded-0"
                          >
                            <i class="zmdi zmdi-delete"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="d-flex align-items-center flex-sb-m bor15 p-t-18 p-b-15 p-lr-40 p-lr-15-sm">
                  <div className="input-group">
                    <div>
                      <select
                        className="flex-c-m stext-101 cl2 size-119 bg8 bor13 p-lr-15 trans-04 pointer m-tb-5 form-select rounded-start-5"
                        onChange={(e) => setSelectedCoupon(e.target.value)}
                        value={selectedCoupon}
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
                      value={selectedCoupon}
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
                          className="w-100 border border-1 p-2 rounded-0 form-select stext-111"
                          aria-label="Default select example"
                        >
                          <option selected>Select a country...</option>
                          <option value="1">Ninh Kiều</option>
                          <option value="2">An Giang</option>
                          <option value="3">TP HCM</option>
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
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="flex-w flex-t p-t-27 p-b-33">
                  <div className="size-208">
                    <span className="mtext-101 cl2">Total:</span>
                  </div>

                  <div className="size-209 p-t-1">
                    <span className="mtext-110 cl2">$79.65</span>
                  </div>
                </div>

                <button className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
export default ShopingCart;

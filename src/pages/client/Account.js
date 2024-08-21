import React, { useState, useRef } from "react";
import Avatar from "../../assets/images/userDefaut.jpg";

const Account = () => {
  const [showToast, setShowToast] = useState(false);
  const couponRefs = useRef([]);

  const handleCopy = (index) => {
    const couponCode = couponRefs.current[index].textContent;
    navigator.clipboard
      .writeText(couponCode)
      .then(() => {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000); // 2 giây hiển thị thông báo
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };
  const styles = {
    container: {
      minHeight: "90vh",
    },
    accountImg: {
      width: "200px",
      height: "200px",
      borderRadius: "50%",
      objectFit: "cover",
      marginBottom: "20px",
    },
    accountImg1: {
      width: "70px",
      height: "70px",
      borderRadius: "50%",
      objectFit: "cover",
      marginBottom: "20px",
    },
    bor8: {
      borderRadius: "8px",
    },
    stext111: {
      fontSize: "16px",
    },
    size111: {
      height: "48px",
    },
    pLr15: {
      paddingLeft: "15px",
      paddingRight: "15px",
    },
    mB12: {
      marginBottom: "12px",
    },
    genderContainer: {
      borderRadius: "8px",
      backgroundColor: "#f0f0f0",
      marginBottom: "12px",
      padding: "5px",
    },
  };

  return (
    <div
      className="container mt-5 pt-5 d-flex justify-content-center"
      style={styles.container}
    >
      <div className="w-full">
        <div className="d-flex align-items-center border-bottom border-2 mb-4">
          <div>
            <img
              src={Avatar}
              alt="User IMG"
              style={styles.accountImg1}
              className="account-img me-4"
            />
          </div>
          <div>
            <h3>Nguyễn Minh Nhựt</h3>
            <p>nhut347927</p>
          </div>
          <div className="d-flex ms-auto flex-column flex-md-row">
            {/* <!-- Button trigger modal --> */}
            <button
              type="button"
              className="rounded-0 flex-c-m stext-106 cl6 size-104 bor4 pointer hov-btn3 trans-04 mb-2 mb-md-0 me-md-4"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              <i className="zmdi zmdi-edit"></i>
              Edit
            </button>

            <button
              type="button"
              className="rounded-0 flex-c-m stext-106 cl6 size-104 bor4 pointer hov-btn3 trans-04"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal9"
            >
              <i className="zmdi zmdi-pin"></i>
              Address
            </button>
          </div>
        </div>
        <div className="row mb-5">
          <div className="col-md-8">
            <h4 className="stext-301 ">Order</h4>
            <div className="wrap-table-shopping-cart">
              <table className="table-shopping-cart">
                <thead>
                  <tr className="table_head">
                    <th className="column-1">Product</th>
                    <th className="column-2"></th>

                    <th className="column-3">Quantity</th>
                    <th className="column-4">Total</th>
                    <th className="column-5">Status</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="table_row">
                    <td className="column-1">
                      <div className="how-itemcart1">
                        <img src="images/item-cart-04.jpg" alt="Product 1" />
                      </div>
                    </td>
                    <td className="column-2">Fresh Strawberries</td>
                    <td className="column-3">5</td>

                    <td className="column-4">$ 36.00</td>
                    <td className="column-5">
                      <span className="badge text-bg-warning">Pending</span>
                    </td>
                  </tr>
                  {/* .................... */}
                  <tr className="table_row">
                    <td className="column-1">
                      <div className="how-itemcart1">
                        <img src="images/item-cart-05.jpg" alt="Product 2" />
                      </div>
                    </td>
                    <td className="column-2">Lightweight Jacket</td>
                    <td className="column-3">5</td>

                    <td className="column-4">$ 36.00</td>
                    <td className="column-5">
                      <span className="badge text-bg-success">Shipped</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-md-4">
            <h4 className="stext-301">Your Coupon</h4>
            <div className="w-full">
              <ul className="list-unstyled">
                {[
                  "GIAMGIANEMAYNI",
                  "GIAMCUCMANH",
                  "QUATROIGIAM",
                  "FHFHFGHFGHFG",
                ].map((code, index) => (
                  <li
                    key={index}
                    className="rounded-0 d-flex align-items-center justify-content-between p-3 mb-3 rounded border border-2"
                  >
                    <div className="d-flex align-items-center me-3">
                      <i className="zmdi zmdi-label me-2"></i>
                      <span
                        ref={(el) => (couponRefs.current[index] = el)}
                        className="stext-106 cl6"
                      >
                        {code}
                      </span>
                    </div>
                    <button
                      className="btn btn-outline-secondary btn-sm d-flex align-items-center"
                      onClick={() => handleCopy(index)}
                    >
                      <i className="zmdi zmdi-copy me-1"></i> Copy
                    </button>
                  </li>
                ))}
              </ul>
              {showToast && (
                <div
                  className="toast show position-fixed bottom-0 end-0 p-3"
                  style={{ zIndex: 1050 }}
                >
                  <div className="toast-body">
                    Coupon code copied to clipboard!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* <!-- Modal ADDRESS -->   */}
        <div
          className="modal fade"
          id="exampleModal9"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content rounded-0 ">
              <div className="modal-header pb-1 pt-2">
                <h1
                  className="modal-title  stext-101 cl5 size-103 d-flex align-items-center"
                  id="exampleModalLabel"
                >
                  Edit Address
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
              
                <form>
                  <div className="form-group mb-3">
                    <label htmlFor="addressInput">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      id="addressInput"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer"
                  >
                    Save
                  </button>
                </form>
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
          <div className="modal-dialog modal-lg ">
            <div className="modal-content rounded-0 ">
              <div className="modal-header pb-1 pt-2">
                <h1
                  className="modal-title  stext-101 cl5 size-103 d-flex align-items-center"
                  id="exampleModalLabel"
                >
                  Edit Profile
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form className="w-100">
                  <div className="row">
                    <div className="col-md-5 text-center">
                      {/* Image */}
                      <img
                        src={Avatar}
                        alt="User IMG"
                        style={styles.accountImg}
                        className="account-img"
                      />
                      {/* Read-only fields */}
                      <div className="mb-4">
                        <h5 className="mb-2">Username: johndoe</h5>
                        <p>Create Date: 2023-08-15</p>
                      </div>
                    </div>

                    <div className="col-md-7">
                      <div className="">
                        {/* Editable fields */}
                        <div className="mb-3">
                          <label htmlFor="full_name">Full Name</label>
                          <div style={{ ...styles.bor8, ...styles.mB12 }}>
                            <input
                              id="full_name"
                              className="form-control rounded-0"
                              style={{
                                ...styles.stext111,
                                ...styles.size111,
                                ...styles.pLr15,
                              }}
                              type="text"
                              name="full_name"
                              placeholder="Full Name"
                              value="John Doe"
                            />
                          </div>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="email">Email</label>
                          <div style={{ ...styles.bor8, ...styles.mB12 }}>
                            <input
                              id="email"
                              className="form-control rounded-0"
                              style={{
                                ...styles.stext111,
                                ...styles.size111,
                                ...styles.pLr15,
                              }}
                              type="email"
                              name="email"
                              placeholder="Email"
                              value="johndoe@example.com"
                            />
                          </div>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="phone">Phone</label>
                          <div style={{ ...styles.bor8, ...styles.mB12 }}>
                            <input
                              id="phone"
                              className="form-control rounded-0"
                              style={{
                                ...styles.stext111,
                                ...styles.size111,
                                ...styles.pLr15,
                              }}
                              type="text"
                              name="phone"
                              placeholder="Phone"
                              value="+1234567890"
                            />
                          </div>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="gender">Gender</label>
                          <div className="d-flex flex-row pl-2 p-2">
                            <div
                              className="form-check"
                              style={{ marginRight: "20px" }}
                            >
                              <input
                                id="gender-male"
                                className="form-check-input m-0 mt-1"
                                type="radio"
                                name="gender"
                                value="Male"
                                defaultChecked
                              />
                              <label
                                htmlFor="gender-male"
                                className="form-check-label"
                              >
                                Male
                              </label>
                            </div>
                            <div
                              className="form-check me-3"
                              style={{ marginRight: "20px" }}
                            >
                              <input
                                id="gender-female"
                                className="form-check-input m-0 mt-1"
                                type="radio"
                                name="gender"
                                value="Female"
                              />
                              <label
                                htmlFor="gender-female"
                                className="form-check-label"
                              >
                                Female
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                id="gender-other"
                                className="form-check-input m-0 mt-1"
                                type="radio"
                                name="gender"
                                value="Other"
                              />
                              <label
                                htmlFor="gender-other"
                                className="form-check-label"
                              >
                                Other
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="birthday">Birthday</label>
                          <div style={{ ...styles.bor8, ...styles.mB12 }}>
                            <input
                              id="birthday"
                              className="form-control rounded-0"
                              style={{
                                ...styles.stext111,
                                ...styles.size111,
                                ...styles.pLr15,
                              }}
                              type="date"
                              name="birthday"
                              value="1990-01-01"
                            />
                          </div>
                        </div>

                        <div className="flex-w">
                          <button
                            type="submit"
                            className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer"
                          >
                            Update Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;

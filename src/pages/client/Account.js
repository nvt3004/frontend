import React from "react";
import Avatar from "../../assets/images/userDefaut.jpg";

const Account = () => {
  const styles = {
    container: {
      height: "90vh",
    },
    accountImg: {
      width: "200px",
      height: "200px",
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
    <div className="container mt-4 mb-5 d-flex align-items-center justify-content-center" style={styles.container}>
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
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
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
                <div className="d-flex flex-row pl-2" style={styles.genderContainer}>
                  <div className="form-check" style={{ marginRight: "20px" }}>
                    <input
                      id="gender-male"
                      className="form-check-input m-0 mt-1"
                      type="radio"
                      name="gender"
                      value="Male"
                      defaultChecked
                    />
                    <label htmlFor="gender-male" className="form-check-label">
                      Male
                    </label>
                  </div>
                  <div className="form-check me-3" style={{ marginRight: "20px" }}>
                    <input
                      id="gender-female"
                      className="form-check-input m-0 mt-1"
                      type="radio"
                      name="gender"
                      value="Female"
                    />
                    <label htmlFor="gender-female" className="form-check-label">
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
                    <label htmlFor="gender-other" className="form-check-label">
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
                    className="form-control"
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
  );
};

export default Account;

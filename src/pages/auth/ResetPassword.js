import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams(); // Token từ URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý cập nhật mật khẩu ở đây
    console.log("Reset password with token:", token);
    console.log("New password:", password);
    // Gửi yêu cầu cập nhật mật khẩu đến server
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Reset Password</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Reset Password
                </button>
              </form>
              <div className="d-flex justify-content-between mt-3">
                <Link
                  to="/auth/login"
                  className="btn btn-link"
                  style={{ textDecoration: "none" }}
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

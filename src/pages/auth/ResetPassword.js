import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { resetPassword } from "../../services/api/OAuthApi";

const ResetPassword = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token"); 

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await resetPassword(token, password);
      if (response) {
        setSuccess("Password reset successfully");
      } else {
        setError("Password reset failed");
      }
    } catch (error) {
      setError(`Password reset failed: ${error.message}`);
    }
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
                {error && <div className="alert alert-danger mt-3">{error}</div>}
                {success && <div className="alert alert-success mt-3">{success}</div>}
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

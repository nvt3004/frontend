import React from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Forgot Password</h3>
              <form>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter your email"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Send Reset Link
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
                <Link
                  to="/auth/register"
                  className="btn btn-link"
                  style={{ textDecoration: "none" }}
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

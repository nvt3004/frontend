import React from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa"; // Import icons from react-icons
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Login</h3>
              <form>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="Enter your email"
                  />
                  <div id="emailHelp" className="form-text">
                    We'll never share your email with anyone else.
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="exampleInputPassword1"
                    placeholder="Enter your password"
                  />
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="exampleCheck1"
                  />
                  <label className="form-check-label" htmlFor="exampleCheck1">
                    Remember me
                  </label>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Login
                </button>
              </form>
              <div className="d-flex justify-content-between mt-3">
                <button
                  className="btn btn-outline-secondary w-48"
                  aria-label="Login with Google"
                >
                  <FaGoogle className="me-2" />
                  Login with Google
                </button>
                <button
                  className="btn btn-outline-secondary w-48"
                  aria-label="Login with Facebook"
                >
                  <FaFacebook className="me-2" />
                  Login with Facebook
                </button>
              </div>
              <div className="d-flex justify-content-between mt-3">
                <Link
                  to="/auth/forgot-password"
                  className="btn btn-link"
                  style={{ textDecoration: "none" }}
                >
                  Forgot password?
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

export default Login;

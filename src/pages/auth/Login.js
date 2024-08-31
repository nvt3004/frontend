import React, { useState, useEffect } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  auth,
  googleProvider,
  facebookProvider,
} from "../../googleSignin/config";
import { fetchSignInMethodsForEmail, signInWithPopup } from "firebase/auth";
import { loginSocial, loginWithEmail } from "../../services/api/ExamProdApi";

const Login = () => {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [value, setValue] = useState("");

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userEmail = user.email;
      const userId = user.uid;
      const provider = "Google";

      console.log("User Email:", userEmail);
      console.log("Username:", userId);

      const userData = {
        email: userEmail,
        username: userId,
        provider: provider,
      };
      await loginSocial(userData);
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  const handleFacebookLogin = async () => {

    try {
      facebookProvider.addScope("email")
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      const userEmail = user.email;
      const userId = user.uid;
      const provider = "Facebook";

      const userData = {
        email: userEmail,
        username: userId,
        provider: provider,
      };

      console.log("email: " + userEmail);

      await loginSocial(userData);
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        console.log("Email đã được liên kết với một phương thức khác.");
      } else {
        console.error("Lỗi đăng nhập khác:", error.message);
      }
    }
  };

  const handleEmailLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await loginWithEmail(username, password);

      if (response.status === 200) {
        console.log("Username:", username);
        console.log("User Password:", password);
      }
    } catch (error) {
      console.error("Error during username login:", error.message);
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setValue(storedUsername);
    }
  }, []);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Login</h3>
              <form onSubmit={handleEmailLogin}>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Email/Number Phone
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="Enter your email"
                    value={username}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  onClick={handleGoogleLogin}
                >
                  <FaGoogle className="me-2" />
                  Login with Google
                </button>
                <button
                  className="btn btn-outline-secondary w-48"
                  aria-label="Login with Facebook"
                  onClick={handleFacebookLogin}
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

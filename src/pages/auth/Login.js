import React, { useState, useEffect } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  auth,
  googleProvider,
  facebookProvider,
} from "../../config/FirebaseConfig";
import {
  getAdditionalUserInfo,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth";
import { loginSocial, loginWithEmail } from "../../services/api/OAuthApi";

const Login = () => {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [value, setValue] = useState("");

  // const fetchUserProfile = async (accessToken) => {
  //   try {
  //     const response = await fetch(
  //       "https://people.googleapis.com/v1/people/me?personFields=birthdays,gender,phoneNumbers",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );
  //     const data = await response.json();
  //     console.log("User Profile:", data);
  //     return data;
  //   } catch (error) {
  //     console.error("Error fetching user profile:", error);
  //   }
  // };

  const handleGoogleLogin = async () => {
    try {
      googleProvider.addScope("email");
      googleProvider.addScope("profile");
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userId = user.uid;
      const provider = "Google";
      const fullName = user.displayName;
      const photoURL = user.photoURL;
      const phone = user.phoneNumber;
      // const accessToken = await user.getIdToken(); 
 
      // Lấy thông tin bổ sung
      // const profileData = await fetchUserProfile(accessToken);

      const additionalUserInfo = getAdditionalUserInfo(result);

      // Xử lý thông tin bổ sung từ Google People API nếu có
      const userEmail = user.email || additionalUserInfo.profile.email;

      if (userEmail) {
        const userData = {
          fullName: fullName,
          email: userEmail,
          username: userId,
          provider: provider,
          image: photoURL,
          phone: phone,
        };
        await loginSocial(userData);
      } else {
        console.log("Email is null. Request user to provide their email.");
        await sendEmailVerification(user);
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  // Hàm xử lý đăng nhập với Facebook
  const handleFacebookLogin = async () => {
    try {
      facebookProvider.addScope("email");
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      const userId = user.uid;
      const providerName = "Facebook";
      const fullName = user.displayName;
      const photoURL = user.photoURL;
      const phone = user.phoneNumber;

      // Lấy thông tin bổ sung
      const additionalUserInfo = getAdditionalUserInfo(result);
      const userEmail = user.email || additionalUserInfo.profile.email;

      if (userEmail) {
        const userData = {
          fullName: fullName,
          email: userEmail,
          username: userId,
          provider: providerName,
          image: photoURL,
          phone: phone,
        };
        await loginSocial(userData);
      } else {
        console.log("Email is null. Request user to provide their email.");
        // Gửi email xác minh nếu cần thiết
        await sendEmailVerification(user);
        // Cập nhật trạng thái UI hoặc thông báo cho người dùng
      }
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
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="Enter your username"
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

import React, { useState, useEffect } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import {
  Link,
  useNavigate,
  useLocation,
  useNavigation,
} from "react-router-dom";
import Cookies from "js-cookie";
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
import {
  loginSocial,
  loginWithEmail,
  getProfile,
} from "../../services/api/OAuthApi";
// import "./Login.css";
import styles from "./Login.css";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {} = useNavigation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [value, setValue] = useState("");
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const from = location.state?.from || "/home";

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

      const additionalUserInfo = getAdditionalUserInfo(result);

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
        navigate(from, { replace: true });

        window.location.reload();
      } else {
        console.log("Email is null. Request user to provide their email.");
        await sendEmailVerification(user);
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      facebookProvider.addScope("email");
      googleProvider.addScope("profile");
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      const userId = user.uid;
      const providerName = "Facebook";
      const fullName = user.displayName;
      const photoURL = user.photoURL;
      const phone = user.phoneNumber;

      const additionalUserInfo = getAdditionalUserInfo(result);
      const userEmail = user.email || additionalUserInfo.profile.email;
      console.log("data: ", user);
      console.log("email: ", additionalUserInfo.profile.email);
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

        navigate(from, { replace: true });
        window.location.reload();
      } else {
        console.log("Email is null. Request user to provide their email.");
        await sendEmailVerification(user);
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
    setError(null); // Reset error before validation

    // Basic validation
    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      const response = await loginWithEmail(username, password);
    
      if (response.status === 200) {
        const token = Cookies.get("token");
        if (token) {
          const profileData = await getProfile();
          setProfile(profileData);
    
          const role = profileData?.listData?.authorities[0]?.authority;
          if (role === "Admin") {
            navigate("/admin");
          } else if (role === "Staff") {
            navigate("/admin/users/manage");
          } else {
            navigate(from, { replace: true });
          }
          window.location.reload();
        }
      }
    } catch (error) {
      if (error?.response?.data?.statusCode === 401) {
        setError("Invalid username or password.");
      } else {
        console.log("Trạng thái: " + error?.response?.data?.statusCode);
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Error during username login:", error.message);
    }
    
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className={styles.loginContainer}>
      <div className="container mt-5 loginContainer">
        <div className="row justify-content-center">
          <div className="col-md-4">
            <div className="card shadow-lg border-0 rounded-lg">
              <div className="card-body p-5">
                <h3 className="card-title text-center mb-4">Login</h3>
                <form onSubmit={handleEmailLogin}>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <div className="mb-3">
                    <label htmlFor="emailInput" className="form-label">
                      Email/Number Phone
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="emailInput"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="passwordInput" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="passwordInput"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 mb-3">
                    Login
                  </button>
                </form>
                <div className="d-flex flex-column gap-3">
                  <button
                    className="btn btn-outline-danger w-100"
                    onClick={handleGoogleLogin}
                  >
                    <FaGoogle className="me-1" />
                    Google
                  </button>
                  <button
                    className="btn btn-outline-primary w-100"
                    onClick={handleFacebookLogin}
                  >
                    <FaFacebook className="me-1" />
                    Facebook
                  </button>
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <Link
                    to="/auth/forgot-password"
                    className="btn btn-link no-underline"
                  >
                    Forgot password?
                  </Link>
                  <Link
                    to="/auth/register"
                    className="btn btn-link no-underline"
                  >
                    Create an account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

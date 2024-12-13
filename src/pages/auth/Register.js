import React, { useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
  useNavigation,
} from "react-router-dom";
import { registerUser, verifyOtp, loginWithEmail } from "../../services/api/OAuthApi";

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {} = useNavigation();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isOtpStage, setIsOtpStage] = useState(false);

  const from = location.state?.from || "/home";

  const handleRegister = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await registerUser({ fullName, username, password });
      if (response.statusCode === 200) {
        setSuccess(
          "Registration successful. Please enter the OTP sent to your email/phone."
        );
        setIsOtpStage(true);
      } else {
        setError(response.error || "Registration failed");
      }
    } catch (error) {
      setError("An error occurred during registration");
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    try {
      const response = await verifyOtp({ username, otp });
  
      if (response.statusCode === 200) {
        setSuccess("OTP verified successfully. You can now login.");

        const loginResponse = await loginWithEmail(username, password);
  
        if (loginResponse.data.statusCode === 200) {
          setSuccess("Login successful.");
          navigate(from, { replace: true });
        } else {
          setError("Login failed after OTP verification.");
        }
      } else {
        setError("An error occurred during OTP verification.");
      }
    } catch (error) {
      console.error("Error: ", error);
      setError("An error occurred during OTP verification.");
    }
  };


  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">
                {isOtpStage ? "Verify OTP" : "Register"}
              </h3>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              {!isOtpStage ? (
                <form onSubmit={handleRegister}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email/Phone Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      placeholder="Enter your email or phone number"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Register
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp}>
                  <div className="mb-3">
                    <label htmlFor="otp" className="form-label">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="otp"
                      placeholder="Enter the OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Verify OTP
                  </button>
                </form>
              )}
              <div className="d-flex justify-content-between mt-3">
                <Link
                  to="/auth/login"
                  className="btn btn-link"
                  style={{ textDecoration: "none" }}
                >
                  Already have an account? Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

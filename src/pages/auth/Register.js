import React, { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser, verifyOtp } from "../../services/api/OAuthApi";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isOtpStage, setIsOtpStage] = useState(false);

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
          "Đăng ký thành công. Vui lòng nhập mã OTP được gửi đến email/điện thoại của bạn."
        );
        setIsOtpStage(true);
      } else {
        setError(response.error || "Đăng ký thất bại.");
      }
    } catch (error) {
      setError("Đã xảy ra lỗi trong quá trình đăng ký.");
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    try {
      const response = await verifyOtp({ username, otp });
      if (response.statusCode === 200) {
        setSuccess(
          "Xác thực OTP thành công. Bạn có thể đăng nhập ngay bây giờ."
        );
        setError("");
      } else {
        setError(response.error || "Xác thực OTP thất bại.");
      }
    } catch (error) {
      setError("Đã xảy ra lỗi trong quá trình xác thực OTP.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">
                {isOtpStage ? "Kiểm tra OTP" : "Đăng ký"}
              </h3>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              {!isOtpStage ? (
                <form onSubmit={handleRegister}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Họ tên
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      placeholder="Nhập họ tên"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email/Điện thoại
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      placeholder="Nhập email hoặc điện thoại"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Mật khẩu
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      Xác nhận mật khẩu
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      placeholder="Nhập mật khẩu xác nhận"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Đăng ký
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp}>
                  <div className="mb-3">
                    <label htmlFor="otp" className="form-label">
                      Nhập OTP
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="otp"
                      placeholder="Nhập OPT"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Kiểm tra OTP
                  </button>
                </form>
              )}
              <div className="d-flex justify-content-between mt-3">
                <Link
                  to="/auth/login"
                  className="btn btn-link"
                  style={{ textDecoration: "none" }}
                >
                  Bạn đã có tài khoản? Đăng nhập
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

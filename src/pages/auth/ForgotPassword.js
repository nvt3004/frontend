import React, { useState, useEffect } from "react";
import { sendResetPasswordEmail } from "../../services/api/OAuthApi";
import { Link } from "react-router-dom";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../config/FirebaseConfig";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isPhone, setIsPhone] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  useEffect(() => {
    if (isPhone && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA verified.");
          },
          "expired-callback": () => {
            console.warn("reCAPTCHA expired.");
          },
        }
      );
    }
  }, [isPhone]);

  const sendResetPasswordSMS = async (phoneNumber) => {
    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        window.recaptchaVerifier
      );
      window.confirmationResult = confirmationResult;
      setConfirmationResult(confirmationResult);
      alert("Đã gửi OTP thành công");
      return confirmationResult;
    } catch (error) {
      console.error("Error sending SMS:", error);
      setError("Có lỗi xảy ra khi gửi SMS");
    }
  };

  const verifyCode = async () => {
    try {
      await confirmationResult.confirm(verificationCode);
      setMessage("Mã xác thực thành công! Bạn có thể khôi phục mật khẩu.");
    } catch (error) {
      console.error("Error verifying code:", error);
      setError("Mã xác thực không chính xác");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      let formattedPhone = phone;

      if (isPhone && !formattedPhone.startsWith("+")) {
        formattedPhone = `+84${formattedPhone.slice(1)}`;
      }

      if (isPhone) {
        await sendResetPasswordSMS(formattedPhone);
        setMessage("Mã xác thực đã được gửi đến điện thoại");
      } else {
        await sendResetPasswordEmail(email);
        setMessage("Email khôi phục mật khẩu đã được gửi thành công");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Quên Mật Khẩu</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-check mb-3">
                  <div className="form-check-item">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="emailOption"
                      name="contactOption"
                      checked={!isPhone}
                      onChange={() => setIsPhone(false)}
                    />
                    <span className="form-check-label ms-2">Email</span>
                  </div>

                  <div className="form-check-item">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="phoneOption"
                      name="contactOption"
                      checked={isPhone}
                      onChange={() => setIsPhone(true)}
                    />
                    <span className="form-check-label ms-2">Số điện thoại</span>
                  </div>
                </div>

                {!isPhone ? (
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Địa chỉ email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Nhập email của bạn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                ) : (
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      placeholder="Nhập số điện thoại của bạn"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                )}
                <button type="submit" className="btn btn-primary w-100">
                  Gửi liên kết khôi phục
                </button>
                {message && (
                  <div className="alert alert-success mt-3">{message}</div>
                )}
                {error && (
                  <div className="alert alert-danger mt-3">{error}</div>
                )}
              </form>

              {isPhone && confirmationResult && (
                <div className="mt-4">
                  <h5>Nhập mã xác thực:</h5>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Nhập mã xác thực"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                  <button
                    className="btn btn-success w-100"
                    onClick={verifyCode}
                  >
                    Xác nhận mã
                  </button>
                </div>
              )}

              <div className="d-flex justify-content-between mt-3">
                <Link
                  to="/auth/login"
                  className="btn btn-link"
                  style={{ textDecoration: "none" }}
                >
                  Quay lại đăng nhập
                </Link>
                <Link
                  to="/auth/register"
                  className="btn btn-link"
                  style={{ textDecoration: "none" }}
                >
                  Tạo tài khoản
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default ForgotPassword;

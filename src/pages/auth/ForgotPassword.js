import React, { useState } from "react";
import {
  sendResetPasswordEmail,
  // Remove the duplicate function or import the correct one
  // sendResetPasswordSMS, 
} from "../../services/api/ExamProdApi";
import { Link } from "react-router-dom";

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../googleSignin/config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isPhone, setIsPhone] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Define the function once
  const sendResetPasswordSMS = async (phoneNumber) => {
    try {
      const recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            // reCAPTCHA đã được giải, cho phép gửi SMS
          },
          "expired-callback": () => {
            // Response hết hạn; yêu cầu người dùng giải lại reCAPTCHA
          },
        },
        auth
      );

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier
      );

      return confirmationResult;
    } catch (error) {
      console.error("Error sending SMS:", error);
      throw new Error(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      if (isPhone) {
        const response = await sendResetPasswordSMS(phone);
        setMessage("Verification code sent to phone");
      } else {
        const response = await sendResetPasswordEmail(email);
        setMessage("Reset password email sent successfully");
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
              <h3 className="card-title text-center mb-4">Forgot Password</h3>
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
                    <span className="form-check-label ms-2">Phone</span>
                  </div>
                </div>

                {!isPhone ? (
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                ) : (
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                      Phone number
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                )}
                <button type="submit" className="btn btn-primary w-100">
                  Send Reset Link
                </button>
                {message && (
                  <div className="alert alert-success mt-3">{message}</div>
                )}
                {error && (
                  <div className="alert alert-danger mt-3">{error}</div>
                )}
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
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default ForgotPassword;

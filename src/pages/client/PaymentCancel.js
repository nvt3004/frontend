import React from "react";
import { Link } from "react-router-dom";

const PaymentCancel = () => {
  const styles = {
    body: {
      textAlign: "center",
      padding: "40px 0",
      background: "#EBF0F5",
    },
    card: {
      background: "#fff3cd", // Màu nền cho cảnh báo
      padding: "60px",
      borderRadius: "4px",
      boxShadow: "0 2px 3px #C8D0D8",
      display: "inline-block",
      margin: "0 auto",
      border: "1px solid #ffeeba", // Viền cho cảnh báo
    },
    iconContainer: {
      borderRadius: "200px",
      height: "200px",
      width: "200px",
      background: "#fff3cd",
      margin: "0 auto",
    },
    title: {
      color: "#856404", // Màu chữ cho cảnh báo
      fontFamily: '"Nunito Sans", "Helvetica Neue", sans-serif',
      fontWeight: 900,
      fontSize: "40px",
      marginBottom: "10px",
    },
    paragraph: {
      color: "#856404", // Màu chữ cho cảnh báo
      fontFamily: '"Nunito Sans", "Helvetica Neue", sans-serif',
      fontSize: "20px",
      margin: 0,
    },
    checkmark: {
      color: "#856404", // Màu chữ cho cảnh báo
      fontSize: "100px",
      lineHeight: "200px",
      marginLeft: "-15px",
    },
  };

  return (
    <div style={styles.body} className="vh-100">
      <div style={styles.card}>
        <div style={styles.iconContainer}>
        <i style={styles.checkmark}>✓</i>
          {/* Thay đổi biểu tượng thành cảnh báo */}
        </div>
        <h1 style={styles.title}>Success</h1>
        <p style={styles.paragraph}>Transaction cancelled successfully!</p>

        <Link to={"/"}>
          <button type="button" className="btn btn-warning mt-3">
            Back to home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancel;

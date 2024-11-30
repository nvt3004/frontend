import React from "react";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  const styles = {
    body: {
      textAlign: "center",
      padding: "40px 0",
      background: "#EBF0F5",
    },
    card: {
      background: "white",
      padding: "60px",
      borderRadius: "4px",
      boxShadow: "0 2px 3px #C8D0D8",
      display: "inline-block",
      margin: "0 auto",
    },
    iconContainer: {
      borderRadius: "200px",
      height: "200px",
      width: "200px",
      background: "#F8FAF5",
      margin: "0 auto",
    },
    title: {
      color: "#88B04B",
      fontFamily: '"Nunito Sans", "Helvetica Neue", sans-serif',
      fontWeight: 900,
      fontSize: "40px",
      marginBottom: "10px",
    },
    paragraph: {
      color: "#404F5E",
      fontFamily: '"Nunito Sans", "Helvetica Neue", sans-serif',
      fontSize: "20px",
      margin: 0,
    },
    checkmark: {
      color: "#9ABC66",
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
        </div>
        <h1 style={styles.title}>Success</h1>
        <p style={styles.paragraph}>Payment success!</p>

        <Link to={"/"}>
          <button type="button" className="btn btn-success mt-3">
            Back to home
          </button>
        </Link>
        
      </div>
    </div>
  );
};

export default PaymentSuccess;

import React from "react";
import "./coupon.css";

const CouponCard = ({ discount = "", code = "", name = "", onSave }) => {
  if (name === "Đã hết hạn") {
    return "";
  }

  return (
    <div className="row py-4 me-4">
      <div className="coupon-container" style={{ width: "300px" }}>
        <div className="coupon-icon">
          <img
            src="https://img.icons8.com/?size=100&id=12089&format=png&color=000000"
            alt="discount-icon"
          />
        </div>
        <div className="coupon-content">
          <h2 className="coupon-discount">Giảm {discount}</h2>
          <p className="coupon-code">Mã: {code}</p>
          <p className="coupon-name text-danger">
            {" "}
            {name === "Đã hết hạn" ? "Đã hết hạn" : `Còn: ${name}`}
          </p>
        </div>
        {name !== "Đã hết hạn" && (
          <button className="coupon-save-btn" onClick={onSave}>
            Lưu
          </button>
        )}
      </div>
    </div>
  );
};

export default CouponCard;

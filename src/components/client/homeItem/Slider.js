import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Slider = () => {
  const [advertisements, setAdvertisements] = useState([]);

  useEffect(() => {
    // Gọi API để lấy dữ liệu quảng cáo
    axios
      .get("/today") // Thay thế bằng URL chính xác của bạn
      .then((response) => {
        setAdvertisements(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, []);

  return (
    <div>
      <div
        id="carouselExampleFade"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        data-bs-interval="4000"
      >
        <div className="carousel-inner">
          {advertisements.map((ad, index) =>
            ad.images.map((image, imgIndex) => (
              <div
                className={`carousel-item ${
                  index === 0 && imgIndex === 0 ? "active" : ""
                }`}
                key={image.imageId}
              >
                <div
                  className="item-slick1"
                  style={{
                    backgroundImage: `url("http://localhost:8080/images/${image.imageUrl}")`,
                  }}
                >
                  <div className="container h-full ">
                    <div className="flex-col-l-m h-full p-t-100 p-b-30 respon5">
                      <div className="">
                        <span className="ltext-101 cl2 respon2">
                          {ad.advName}
                        </span>
                      </div>

                      <div className="">
                        <h2 className="ltext-201 cl2 p-t-19 p-b-43 respon1">
                          {ad.advDescription}
                        </h2>
                      </div>

                      <div className="l">
                        <Link
                          to="/product"
                          className="text-decoration-none flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04"
                        >
                          Shop Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="prev"
        >
          <span
            className="rounded-5 carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleFade"
          data-bs-slide="next"
        >
          <span
            className="rounded-5 carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default Slider;

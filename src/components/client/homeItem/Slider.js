import React from "react";
import { Link } from "react-router-dom";
import slider1 from "../../../assets/images/slide-01.jpg";
import slider2 from "../../../assets/images/slide-02.jpg";
import slider3 from "../../../assets/images/slide-03.jpg";

const Slider = () => {
  return (
    <div>
      {/* <!-- Thanh trượt --> */}
      <div
        id="carouselExampleFade"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        data-bs-interval="4000"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div
              className="item-slick1"
              style={{ backgroundImage: `url("${slider1}")` }}
            >
              <div className="container h-full">
                <div className="flex-col-l-m h-full p-t-100 p-b-30 respon5">
                  <div className="">
                    <span className="ltext-101 cl2 respon2">
                      Bộ Sưu Tập Nữ 2024
                    </span>
                  </div>

                  <div className="">
                    <h2 className="ltext-201 cl2 p-t-19 p-b-43 respon1">
                      MÙA MỚI
                    </h2>
                  </div>

                  <div className="l">
                    <Link
                      to="/product"
                      className="text-decoration-none flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04"
                    >
                      Mua Ngay
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="carousel-item">
            <div
              className="item-slick1"
              style={{ backgroundImage: `url("${slider2}")` }}
            >
              <div className="container h-full">
                <div className="flex-col-l-m h-full p-t-100 p-b-30 respon5">
                  <div className="">
                    <span className="ltext-101 cl2 respon2">
                      Áo Khoác & Áo Choàng
                    </span>
                  </div>

                  <div className="">
                    <h2 className="ltext-201 cl2 p-t-19 p-b-43 respon1">
                      Bộ Sưu Tập Nam
                    </h2>
                  </div>

                  <div className="l">
                    <Link
                      to="/product"
                      className="text-decoration-none flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04"
                    >
                      Mua Ngay
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="carousel-item">
            <div
              className="item-slick1"
              style={{ backgroundImage: `url("${slider3}")` }}
            >
              <div className="container h-full">
                <div className="flex-col-l-m h-full p-t-100 p-b-30 respon5">
                  <div className="">
                    <span className="ltext-101 cl2 respon2">
                      Bộ Sưu Tập Nam 2024
                    </span>
                  </div>

                  <div className="">
                    <h2 className="ltext-201 cl2 p-t-19 p-b-43 respon1">
                      HÀNG MỚI VỀ
                    </h2>
                  </div>

                  <div className="l">
                    <Link
                      to="/product"
                      className="text-decoration-none flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04"
                    >
                      Mua Ngay
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
          <span className="visually-hidden">Trước</span>
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
          <span className="visually-hidden">Sau</span>
        </button>
      </div>
    </div>
  );
};

export default Slider;

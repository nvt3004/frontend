import React from "react";
import { Link } from "react-router-dom";
import Avatar from "../assets/images/PageNotFound.png";

const PageNotFound = () => {
  const style = {
    mh: {
      minHeight: "100vh",
    },
    fsw: {
      fontSize: "55px",
      fontWeight: "bolder",
    },
  };
  return (
    <div
      className="container d-flex align-items-center justify-content-center"
      style={style.mh}
    >
      <div className="row w-100">
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img src={Avatar} alt="" className="img-fluid" />
        </div>
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div>
            <h1 className="mt-4 mb-2 text-dark" style={style.fsw}>
              404
            </h1>
            <h2 className="mb-2 text-dark">UH OH! You're lost.</h2>
            <p className="mb-4">
              The page you are looking for does not exist. How you got here is a
              mystery. But you can click the button below to go back to the
              homepage.
            </p>
            <Link
              to="/home"
              className="text-decoration-none flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;

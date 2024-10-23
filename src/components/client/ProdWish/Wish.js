import React from "react";
import { Link } from "react-router-dom";
import icon1 from "../../../assets/images/icons/icon-heart-01.png"
import icon2 from "../../../assets/images/icons/icon-heart-02.png"
const AddWish = ({ prodID, isWish, handleAddWish, handleRemoveWish }) => {
  return (
    <div>
      <span
        to="#"
        className="btn-addwish-b2 dis-block pos-relative js-addwish-b2"
      >
        <img
          className="dis-block trans-04"
          src={icon1}
          alt="ICON"
          onClick={() => {
            handleAddWish(prodID);
          }}
        />
        {isWish === true ? (
          <img
            className="dis-block trans-04 ab-t-l"
            src={icon2}
            alt="ICON"
            onClick={() => {
              handleRemoveWish(prodID);
            }}
          />
        ) : (
          ""
        )}
      </span>
    </div>
  );
};
export default AddWish;

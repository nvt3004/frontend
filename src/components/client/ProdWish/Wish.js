import React from "react";
import { Link } from "react-router-dom";
const AddWish = ({ prodID, isWish, handleAddWish, handleRemoveWish }) => {
  return (
    <div>
      <span
        to="#"
        className="btn-addwish-b2 dis-block pos-relative js-addwish-b2"
      >
        <img
          className="dis-block trans-04"
          src="images/icons/icon-heart-01.png"
          alt="ICON"
          onClick={() => {
            handleAddWish(prodID);
          }}
        />
        {isWish === true ? (
          <img
            className="dis-block trans-04 ab-t-l"
            src="images/icons/icon-heart-02.png"
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

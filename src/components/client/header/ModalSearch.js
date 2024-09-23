import React from "react";
const ModalSearch = ({ isVisible, onClose }) => (
    isVisible && (
      <div className="modal-search-header flex-c-m trans-04 js-hide-modal-search">
        <div className="container-search-header">
          <button className="flex-c-m btn-hide-modal-search trans-04 js-hide-modal-search" onClick={onClose}>
            <img src="images/icons/icon-close2.png" alt="CLOSE" />
          </button>
          <form className="wrap-search-header flex-w p-l-15">
            <button className="flex-c-m trans-04">
              <i className="zmdi zmdi-search"></i>
            </button>
            <input className="plh3" type="text" name="search" placeholder="Search..." />
          </form>
        </div>
      </div>
    )
  );
  
  export default ModalSearch;
  
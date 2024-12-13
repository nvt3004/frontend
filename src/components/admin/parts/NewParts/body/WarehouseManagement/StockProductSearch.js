import React, { useState, useCallback } from "react";
import {
  CaretDoubleLeft,
  CaretDoubleRight,
  MagnifyingGlass,
} from "phosphor-react"; // Đảm bảo import đúng các icon
import debounce from "lodash.debounce"; // Import debounce từ lodash

const StockProductSearch = ({
  products,
  handleNext,
  handlePrev,
  handleSearchs,
  handleClickItem,
  isNext,
  isPrev,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearch = useCallback(
    debounce((value) => {
      handleSearchs(value);
    }, 500),
    []
  );

  // Hàm lọc sản phẩm khi nhập vào ô tìm kiếm
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Hàm xử lý việc thay đổi trang
  const nextPage = () => {
    handleNext();
  };

  const prevPage = () => {
    handlePrev();
  };

  return (
    <>
      {/* <label>Tìm kiếm sản phẩm</label> */}
      <div className="input-group input-group-merge">
        <span className="input-group-text" id="basic-addon-search31">
          <MagnifyingGlass />
        </span>
        <input
          onChange={handleSearch} // Sử dụng hàm handleSearch thay vì onChangeSearch trực tiếp
          value={searchQuery} // Hiển thị giá trị keyword trong input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm..."
          aria-label="Tìm kiếm..."
          aria-describedby="basic-addon-search31"
        />
      </div>

      {/* Hiển thị các sản phẩm */}
      <div className="w-100 bg-white p-4">
        <div
          className="d-flex justify-content-between align-items-center"
          style={{ gap: "30px" }}
        >
          <button
            className="btn btn-dark p-0 bg-dark"
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            onClick={prevPage}
            disabled={isPrev}
          >
            <CaretDoubleLeft />
          </button>

          {/* Hiển thị các sản phẩm */}
          <div className="row row-cols-1 row-cols-md-4 g-4" style={{ flex: 1 }}>
            {products ? (
              products.map((product) => (
                <div
                  onClick={() => {
                    handleClickItem(product);
                  }}
                  className="col"
                  key={product.id}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card h-100">
                    <img
                      className="card-img-top"
                      src={product.image}
                      alt={product.productName}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h6 className="card-title">{product.productName}</h6>
                      <p className="">
                        Trong kho:{" "}
                        {product.totalStock < 0 ? 0 : product.totalStock}
                      </p>
                      <p className="">
                        Số lượng phiên bản: {product.versions.length}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col">
                <div className="card h-100">
                  <div className="card-body">
                    <p className="card-text text-center">
                      Không tìm thấy sản phẩm
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            className="btn btn-dark p-0"
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
            onClick={nextPage}
            disabled={isNext}
          >
            <CaretDoubleRight />
          </button>
        </div>
      </div>
    </>
  );
};

export default StockProductSearch;

import React, { useState } from "react";
import {
  CaretDoubleLeft,
  CaretDoubleRight,
  MagnifyingGlass,
} from "phosphor-react"; // Đảm bảo import đúng các icon

const StockProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  // Dữ liệu sản phẩm mẫu
  const products = [
    {
      id: 1,
      name: "Product A",
      price: "100,000₫",
      image: "http://localhost:8080/images/1732213977085.jpg",
    },
    {
      id: 2,
      name: "Product B",
      price: "200,000₫",
      image: "http://localhost:8080/images/1732213977085.jpg",
    },
    {
      id: 3,
      name: "Product C",
      price: "300,000₫",
      image: "http://localhost:8080/images/1732213977085.jpg",
    },
    {
      id: 4,
      name: "Product D",
      price: "150,000₫",
      image: "http://localhost:8080/images/1732213977085.jpg",
    },
    {
      id: 5,
      name: "Product E",
      price: "250,000₫",
      image: "http://localhost:8080/images/1732213977085.jpg",
    },
    {
      id: 6,
      name: "Product F",
      price: "350,000₫",
      image: "http://localhost:8080/images/1732213977085.jpg",
    },
    {
      id: 7,
      name: "Product G",
      price: "400,000₫",
      image: "http://localhost:8080/images/1732213977085.jpg",
    },
    {
      id: 8,
      name: "Product H",
      price: "450,000₫",
      image: "http://localhost:8080/images/1732213977085.jpg",
    },
  ];

  // Hàm lọc sản phẩm khi nhập vào ô tìm kiếm
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset trang khi thay đổi tìm kiếm
  };

  // Hàm xử lý việc thay đổi trang
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredProducts.length / productsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Lấy các sản phẩm hiển thị theo trang
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  return (
    <>
      <label>Tìm kiếm sản phẩm</label>
      <div className="input-group input-group-merge">
        <span className="input-group-text" id="basic-addon-search31">
          <MagnifyingGlass />
        </span>
        <input
          onChange={handleSearch} // Sử dụng hàm handleSearch thay vì onChangeSearch trực tiếp
          value={searchQuery} // Hiển thị giá trị keyword trong input
          type="text"
          className="form-control"
          placeholder="Search..."
          aria-label="Search..."
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
            style={{ width: "50px", height: '50px', borderRadius: '50%' }}
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            <CaretDoubleLeft />
          </button>

          {/* Hiển thị các sản phẩm */}
          <div className="row row-cols-1 row-cols-md-4 g-4" style={{ flex: 1 }}>
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <div
                  className="col"
                  key={product.id}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card h-100">
                    <img
                      className="card-img-top"
                      src={product.image}
                      alt={product.name}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="">
                        Trong kho: 250
                      </p>
                      <p className="">
                        35 phiên bản
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
            style={{ width: "50px", height: '50px', borderRadius: '50%' }}
            onClick={nextPage}
            disabled={
              currentPage ===
              Math.ceil(filteredProducts.length / productsPerPage)
            }
            
          >
            <CaretDoubleRight />
          </button>
        </div>
      </div>
    </>
  );
};

export default StockProductSearch;

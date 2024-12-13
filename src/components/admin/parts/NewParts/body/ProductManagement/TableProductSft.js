import React, { useState, useCallback } from "react";
import debounce from "lodash.debounce";
import { MagnifyingGlass, CaretDoubleRight, CaretDoubleDown } from "phosphor-react";

function formatCurrencyVND(amount) {
  return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

const TableProductStf = ({
  dataSource,
  columns,
  title,
  buttonTable,
  isSearch,
  onChangeSearch = (value) => {},
  keyword = "",
}) => {
  const [searchKeyword, setSearchKeyword] = useState(keyword);
  const [expandedProductId, setExpandedProductId] = useState(null);

  const debouncedSearch = useCallback(
    debounce((value) => {
      onChangeSearch(value);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    debouncedSearch(value);
  };

  // Hàm toggle để mở rộng hoặc thu gọn bảng con
  const toggleExpand = (productId) => {
    setExpandedProductId((prevId) => (prevId === productId ? null : productId));
  };

  return (
    <div className="card">
      <h5 className="card-header">{title}</h5>

      <div className="row">
        <div className="col-9 px-4 mb-3">{buttonTable && buttonTable}</div>

        {isSearch && (
          <div className="col-3 px-4">
            <div className="input-group input-group-merge">
              <span className="input-group-text" id="basic-addon-search31">
                <MagnifyingGlass />
              </span>
              <input
                onChange={handleSearchChange}
                value={searchKeyword}
                type="text"
                className="form-control"
                placeholder="Tìm kiếm"
                aria-label="Search..."
                aria-describedby="basic-addon-search31"
              />
            </div>
          </div>
        )}
      </div>

      <div className="table-responsive text-nowrap">
        <table className="table table-hover">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key || col.dataIndex}>{col.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataSource.map((item, index) => (
              <>
                {/* Hiển thị thông tin sản phẩm chính */}
                <tr key={item.id}>
                  {columns.map((col) => (
                    <td
                      key={col.key || col.dataIndex}
                      className={col.className ? `text-${col.className}` : ""}
                    >
                      {col.render
                        ? col.render(item[col.dataIndex], item, index)
                        : item[col.dataIndex]}
                    </td>
                  ))}
                  <td
                    onClick={() => toggleExpand(item.id)}
                    style={{ cursor: "pointer" }}
                  >
                    {expandedProductId === item.id ? (
                      <CaretDoubleDown />
                    ) : (
                      <CaretDoubleRight />
                    )}
                  </td>
                </tr>

                {/* Hiển thị bảng con nếu sản phẩm đang được mở rộng */}
                {expandedProductId === item.id && (
                  <tr>
                    <td></td>
                    <td colSpan={columns.length}>
                      <div className="table-responsive text-nowrap">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th className="text-start">Tên Phiên bản</th>
                              <th>Giá Phiên Bản</th>
                              {/* <th>Import Price</th> */}
                              <th>Số lượng</th>
                              <th>Ảnh</th>
                              <th>Thuộc tính</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item?.versions.filter(i=> i.active).map((version, versionIndex) => (
                              <tr key={version.id}>
                                <td className="text-start">
                                  {version.versionName}
                                </td>
                                <td>{formatCurrencyVND(version.retailPrice)}</td>
                                {/* <td>{formatCurrencyVND(version.importPrice)}</td> */}
                                <td>{version.quantity}</td>
                                <td>
                                  <img
                                    src={version?.image?.name}
                                    alt={version?.versionName}
                                    style={{ width: 50, height: 50 }}
                                  />
                                </td>
                                <td>
                                  {version.attributes.map((attr) => (
                                    <div
                                      className="text-capitalize"
                                      key={attr.id}
                                    >
                                      {attr.key}: {attr.value}
                                    </div>
                                  ))}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableProductStf;

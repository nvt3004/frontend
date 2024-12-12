import React, { useState, useCallback } from "react";
import debounce from "lodash.debounce"; // Import debounce từ lodash
import { MagnifyingGlass } from "phosphor-react";

const DataTableSft = ({
  dataSource,
  columns,
  title,
  buttonTable,
  isSearch,
  onChangeSearch = (value) => {},
  keyword = "", // Thêm prop keyword để nhận giá trị tìm kiếm
}) => {
  const [searchKeyword, setSearchKeyword] = useState(keyword);

  const debouncedSearch = useCallback(
    debounce((value) => {
      onChangeSearch(value);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    debouncedSearch(value); // Thực hiện debounce khi người dùng gõ
  };

  return (
    <div className="card">
      <h5 className="card-header">{title}</h5>

      <div className="row">
        <div className="col-9 px-4 mb-3">{buttonTable && buttonTable}</div>

        {/* Thanh tìm kiếm */}
        {isSearch && (
          <div className="col-3 px-4">
            <div className="d-flex align-items-center h-100">
              <div className="input-group input-group-merge">
                <span className="input-group-text" id="basic-addon-search31">
                  <MagnifyingGlass />
                </span>
                <input
                  onChange={handleSearchChange} // Sử dụng hàm handleSearchChange thay vì onChangeSearch trực tiếp
                  value={searchKeyword} // Hiển thị giá trị keyword trong input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm"
                  aria-label="Search..."
                  aria-describedby="basic-addon-search31"
                />
              </div>
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
              <tr key={item.key || index}>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTableSft;

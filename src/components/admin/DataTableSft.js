import React from "react";
import { MagnifyingGlass } from "phosphor-react";

const DataTableSft = ({
  dataSource,
  columns,
  title,
  buttonTable,
  isSearch,
  onChangeSearch = (value) => {},
}) => {
  return (
    <div className="card">
      <h5 className="card-header">{title}</h5>

      <div className="row">
        {/* Các nút xử lý trên table */}
        <div className="col-9 px-4 mb-3">{buttonTable && buttonTable}</div>

        {/* Thanh tìm kiếm */}
        {isSearch && (
          <div className="col-3 px-4">
            <div className="input-group input-group-merge">
              <span className="input-group-text" id="basic-addon-search31">
                {<MagnifyingGlass />}
              </span>
              <input
                onChange={(e) => {
                  onChangeSearch(e.target.value);
                }}
                type="text"
                className="form-control"
                placeholder="Search..."
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
              <tr key={item.key || index}>
                {columns.map((col) => (
                  <td key={col.key || col.dataIndex}>
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

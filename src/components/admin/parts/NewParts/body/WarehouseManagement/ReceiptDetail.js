import React, { useEffect, useRef, useState, version } from "react";
import { Trash } from "phosphor-react";
import DataTableSft from "../../../../DataTableSft";
import { toast } from "react-toastify";
import { stfExecAPI } from "../../../../../../stf/common";
import moment from "moment";
import FullScreenSpinner from "../../../FullScreenSpinner";
import { useLocation } from "react-router-dom";

function formatCurrencyVND(amount) {
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

const currentDate = moment().format("DD/MM/YYYY");

const ReceiptDetail = () => {
  const location = useLocation();
  const [receipt, setReceipt] = useState(location?.state);
  const [loading, setLoading] = useState(false);

  //Cấu hình table
  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (text, record) => {
        return (
          <img
            src={text}
            alt="Product"
            style={{ width: 50, height: 50, cursor: "pointer" }}
          />
        );
      },
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá Nhập",
      dataIndex: "importPrice",
      key: "importPrice",
      render: (value, row) => {
        return formatCurrencyVND(value);
      },
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Tổng Tiền",
      dataIndex: "total",
      key: "total",
      render: (value, record) => {
        return formatCurrencyVND(value);
      },
    },
  ];

  return (
    <>
      <FullScreenSpinner isLoading={loading} />

      <div className="row mb-3 d-flex">
        <div className="col-7 d-flex">
          <div className="card p-4 w-100">
            <label htmlFor="exampleFormControlSelect1" className="form-label">
              Nhà cung cấp
            </label>
            <div className="mt-3">
              <div className="row mb-3">
                <div className="col-6">
                  <label>
                    <strong>Tên nhà cung cấp:</strong>{" "}
                    <span>{receipt?.supplierName}</span>
                  </label>
                </div>
                <div className="col-6">
                  <label>
                    <strong>Email:</strong>{" "}
                    <span>{receipt?.supplierEmail}</span>
                  </label>
                </div>
              </div>

              <div className="row">
                <div className="col-6">
                  <label>
                    <strong>Số điện thoại:</strong>{" "}
                    <span>{receipt?.supplierPhone}</span>
                  </label>
                </div>
                <div className="col-6">
                  <label>
                    <strong> Địa chỉ:</strong>{" "}
                    <span>{receipt?.supplierAddress}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-5 d-flex">
          <div className="card p-4 w-100">
            <div className="row mb-3">
              <label>
                <strong>Người nhập: </strong>
                <span> {receipt?.fullname}</span>
              </label>
            </div>

            <div className="row mb-3">
              <label>
                <strong>Ngày nhập: </strong>
                <span>{receipt?.receiptDate}</span>
              </label>
            </div>

            <div className="row mb-3">
              <label>
                <strong>Tổng số lượng sản phẩm: </strong>
                <span>{receipt?.totalQuantity}</span>
              </label>
            </div>

            <div className="row mb-3">
              <label>
                <strong>Tổng tiền phải trả: </strong>
                <span className="text-danger">
                  {formatCurrencyVND(receipt?.totalPrice || 0)}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div
          className="col-12"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >

          <DataTableSft
            dataSource={receipt?.detais || []}
            columns={columns}
            title={"Sản Phẩm"}
          />
        </div>
      </div>
    </>
  );
};

export default ReceiptDetail;

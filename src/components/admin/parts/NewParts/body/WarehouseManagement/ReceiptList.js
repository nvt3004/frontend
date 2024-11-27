import React, { useEffect, useState } from "react";
import { stfExecAPI } from "../../../../../../stf/common";
import { toast } from "react-toastify";
import FullScreenSpinner from "../../../FullScreenSpinner";
import DataTableSft from "../../../../DataTableSft";
import PaginationSft from "../../../../PaginationSft";
import { useNavigate } from "react-router-dom";

function formatCurrencyVND(amount) {
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

const ReceiptList = () => {
  const [receipts, setReceipt] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ********** Cấu hình table*********
  const columns = [
    {
      title: "Mã Phiếu Nhập",
      dataIndex: "receiptId",
      key: "receiptId",
      render: (text, record) => {
        return (
          <span
            style={{
              color: "#6610f2",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => {
              navigate("/admin/warehouse/detail", {
                state: record,
              });
            }}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: "Tên Nhà Cung Cấp",
      dataIndex: "supplierName",
      key: "supplierName",
    },
    { title: "Ngày Nhập", dataIndex: "receiptDate", key: "receiptDate" },
    { title: "Người Nhập", dataIndex: "fullname", key: "fullname" },
    {
      title: "Số lượng Sản Phẩm",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
    },
    {
      title: "Tổng Tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value, row) => {
        return formatCurrencyVND(value);
      },
    },
  ];

  //Đổ danh sách phiếu nhập
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const [error, data] = await stfExecAPI({
        url: `api/staff/receipt?page=${0}&size=${8}`,
      });

      if (data) {
        setLoading(false);
        setReceipt(data.data);
        console.log(data.data.content);
        return;
      }

      const err =
        error.status === 403
          ? "Bạn không có quyền để thực thi công việc này !"
          : error?.response?.data?.message;

      toast.error(`${err}`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });

      setLoading(false);
    };

    fetchUsers();
  }, []);

  const onChangePagination = async (page) => {
    setLoading(true);
    const [error, data] = await stfExecAPI({
      url: `api/staff/receipt?page=${page - 1}&size=${8}`,
    });

    setLoading(false);
    if (data) {
      setReceipt(data.data);
    }
  };

  return (
    <>
      <FullScreenSpinner isLoading={loading} />
      <DataTableSft
        dataSource={receipts?.content || []}
        columns={columns}
        title={"Danh sách phiếu nhập"}
      />

      <div className="d-flex justify-content-end align-items-center mt-3">
        {/* <p className="me-3">Total 247 item</p> */}
        {receipts.totalPages > 1 && (
          <PaginationSft
            count={receipts.totalPages}
            defaultPage={(receipts.number || 0) + 1}
            siblingCount={1}
            onPageChange={onChangePagination}
          />
        )}
      </div>
    </>
  );
};

export default ReceiptList;

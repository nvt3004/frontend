import React, { useEffect, useState } from "react";
import { stfExecAPI } from "../../../../../../stf/common";
import { toast } from "react-toastify";
import FullScreenSpinner from "../../../FullScreenSpinner";
import DataTableSft from "../../../../DataTableSft";
import ModalSft from "../../../../ModalSft";
import PaginationSft from "../../../../PaginationSft";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { ChatCircleDots } from "phosphor-react";

function formatCurrencyVND(amount) {
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

function formatNumber(input) {
  if (typeof input !== "number") {
    throw new Error("Input must be a number");
  }
  return input.toLocaleString("vi-VN");
}

function formatDateToDDMMYYYY(isoString) {
  const date = new Date(isoString); // Chuyển chuỗi ISO thành đối tượng Date

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày, thêm 0 nếu cần
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Lấy tháng (bắt đầu từ 0)
  const year = date.getFullYear(); // Lấy năm

  return `${day}/${month}/${year}`;
}

const FeedbacksTable = () => {
  const [receipts, setReceipt] = useState({});
  const [loading, setLoading] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState({});
  const navigate = useNavigate();

  // ********** Cấu hình table*********
  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      key: "productName",
      //   render: (text, record) => {
      //     return (
      //       <span
      //         style={{
      //           color: "#6610f2",
      //           cursor: "pointer",
      //           textDecoration: "underline",
      //         }}
      //         onClick={() => {
      //           navigate("/admin/warehouse/detail", {
      //             state: record,
      //           });
      //         }}
      //       >
      //         {text}
      //       </span>
      //     );
      //   },
    },
    {
      title: "Phản hồi",
      dataIndex: "feedbackDate",
      key: "feedbackDate",
      render: (value, fb) => {
        return (
          <div className="flex-w flex-t p-b-68">
            <div className="size-207">
              <div className="flex-w flex-sb-m p-b-17">
                {/* User Name */}
                <div className="d-flex align-items-center">
                  <span className="mtext-107 cl2 p-r-20">
                    {fb?.user?.fullName}
                  </span>
                  <p className="stext-104 cl6">
                    {moment(fb?.feedbackDate).format("DD/MM/YYYY")}
                  </p>
                </div>
                <span className="fs-18 cl11">
                  {Array.from({ length: 5 }, (_, i) => (
                    <i
                      key={i}
                      className={`zmdi zmdi-star${
                        i < fb?.rating ? "" : "-outline"
                      }`}
                    ></i>
                  ))}
                </span>
              </div>

              <p className="stext-102 cl6">{fb.comment}</p>
              {fb?.images?.map((img, index) => (
                <img
                  key={index}
                  className="me-2 mb-3"
                  style={{ width: "100px", height: "100px" }}
                  src={img}
                  alt={`Img ${index}`}
                />
              ))}

              {fb?.reply && (
                <div className="bg-body-secondary p-3">
                  <p className="stext-102 cl6">
                    <span className="fs-6 text-dark">
                      {fb?.reply?.userReply?.fullName}
                    </span>{" "}
                    <span className="mx-3">
                      {moment(fb?.reply?.replyDate).format("DD/MM/YYYY")}
                    </span>
                  </p>
                  {/* Reply Section */}
                  {fb?.reply && (
                    <div className="flex-w flex-t reply-section">
                      <div>
                        {/* <span className="mtext-107 cl2">STTF STORE</span> */}
                        <p className="stext-102 cl6">{fb?.reply?.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Trả lời",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
      render: (value, row) => {
        return row?.reply ? (
          <span>Đã trả lời</span>
        ) : (
          <button
            className={`btn ${"btn-dark"} btn-sm`}
            onClick={() => {
              setFeedback({ ...row });
              setIsModalDeleteOpen(true);
            }}
          >
            <ChatCircleDots weight="bold" size={28} />
          </button>
        );
      },
    },
  ];

  //Đổ danh sách phản hồi
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const [error, data] = await stfExecAPI({
        url: `api/staff/feedback/dashboard?page=${1}&idProduct=${-1}`,
      });

      if (data) {
        setLoading(false);
        setReceipt(data.data);
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

  //Modal xóa
  const handleModalDeleteOk = async () => {
    if (!reason.trim()) {
      toast.error(`Câu trả lời không được để trống`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });

      return;
    }

    setLoading(true);
    const [error, data] = await stfExecAPI({
      method: "post",
      url: `api/admin/reply/add`,
      data: {
        feedbackId: feedback?.feedbackId,
        content: reason,
      },
    });

    if (error) {
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
      return;
    }

    const fetchUsers = async () => {
      const [error, data] = await stfExecAPI({
        url: `api/staff/feedback/dashboard?page=${1}&idProduct=${-1}`,
      });

      if (data) {
        setReceipt(data.data);
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
    };

    fetchUsers();
    setLoading(false);

    toast.success(`Thành công`, {
      className: "toast-message",
      position: "top-right",
      autoClose: 5000,
    });

    setLoading(false);
    setFeedback({});
    setReason("");
    setIsModalDeleteOpen(false); // Đóng modal khi nhấn "Save changes"
  };

  const handleModalDeleteCancel = () => {
    setReason("");
    setFeedback({});
    setIsModalDeleteOpen(false); // Đóng modal khi nhấn "Close"
  };

  return (
    <>
      <FullScreenSpinner isLoading={loading} />
      <DataTableSft
        dataSource={receipts?.contents || []}
        columns={columns}
        title={"Danh sách phản hồi sản phẩm"}
      />

      <div className="d-flex justify-content-end align-items-center mt-3">
        {/* <p className="me-3">Total 247 item</p> */}
        {receipts.totalPages > 1 && (
          <PaginationSft
            count={receipts.totalPage}
            defaultPage={(receipts.number || 0) + 1}
            siblingCount={1}
            onPageChange={onChangePagination}
          />
        )}
      </div>

      {/* Modal xóa */}
      <ModalSft
        title={"Trả lời"}
        titleOk={"Ok"}
        open={isModalDeleteOpen}
        onOk={handleModalDeleteOk}
        onCancel={handleModalDeleteCancel}
        size="modal-lg"
      >
        <div>
          <label for="" className="mb-2">
            Câu trả lời
          </label>
          <textarea
            class="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
            value={reason}
            onInput={(e) => setReason(e.target.value)}
            placeholder="Nhập câu trả lời"
          ></textarea>
        </div>
      </ModalSft>
    </>
  );
};

export default FeedbacksTable;

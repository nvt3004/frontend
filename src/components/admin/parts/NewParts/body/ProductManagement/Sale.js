import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import PaginationSft from "../../../../PaginationSft";
import DataTableSft from "../../../../DataTableSft";
import ModalSft from "../../../../ModalSft";
import { useNavigate } from "react-router-dom";
import {
  Pencil,
  Trash,
  Plus,
  UserCirclePlus,
  CalendarBlank,
} from "phosphor-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import moment from "moment";
import { stfExecAPI } from "../../../../../../stf/common";
import FullScreenSpinner from "../../../FullScreenSpinner";

function formatDateString(dateString, format) {
  const date = new Date(dateString);

  if (isNaN(date)) {
    return ""; // Trả về chuỗi rỗng nếu date không hợp lệ
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  // Thay thế các ký tự định dạng
  return format.replace("DD", day).replace("MM", month).replace("YYYY", year);
}

function Sale() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(-1);
  const [sales, setSales] = useState({});
  const [sale, setSale] = useState({});
  const [keyword, setKeyword] = useState("");
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const navigate = useNavigate();
  const startDatePickerRef = useRef();
  const endDatePickerRef = useRef();
  const [startDate, setStartDate] = useState(
    formatDateString(new Date(), "YYYY/MM/DD")
  );
  const [endDate, setEndDate] = useState(
    formatDateString(new Date(), "YYYY/MM/DD")
  );

  //Đổ danh sách sale
  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      const [error, data] = await stfExecAPI({
        url: `api/admin/sale/all?page=${1}&size=${8}&keyword=${keyword}&startDate=${formatDateString(
          startDate,
          "YYYY/MM/DD"
        )}&endDate=${formatDateString(endDate, "YYYY/MM/DD")}&status=${status}`,
      });

      if (data) {
        setLoading(false);
        setSales(data.data);
        return;
      }

      setLoading(false);
      const err =
        error.status === 403
          ? "Bạn không có đủ phân quyền để thực thi công việc này !"
          : error?.response?.data?.message;

      toast.error(`${err}`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      console.log(err);
    };

    fetchSales();
  }, [startDate, endDate]);

  const onChangeInputSearch = async (value) => {
    setKeyword(value);
    setLoading(true);

    const [error, data] = await stfExecAPI({
      url: `api/admin/sale/all?page=${
        sales?.number || 1
      }&size=${8}&keyword=${value}&&startDate=${formatDateString(
        startDate,
        "YYYY/MM/DD"
      )}&endDate=${formatDateString(endDate, "YYYY/MM/DD")}&status=${status}`,
    });
    setLoading(false);
    if (data) {
      setSales(data.data);
    } else {
      const err =
        error.status === 403
          ? "Bạn không có quyền để thực thi công việc này !"
          : error?.response?.data?.message;
      toast.error(`${err}`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      setSales({});
    }
  };

  const handleChangeSelectFilterActive = async (value) => {
    setLoading(true);

    const [error, data] = await stfExecAPI({
      url: `api/admin/sale/all?page=${1}&size=${8}&keyword=${
        keyword || ""
      }&startDate=${formatDateString(
        startDate,
        "YYYY/MM/DD"
      )}&endDate=${formatDateString(endDate, "YYYY/MM/DD")}&status=${value}`,
    });
    setLoading(false);
    if (data) {
      setSales(data.data);
    } else {
      const err =
        error.status === 403
          ? "Bạn không có quyền để thực thi công việc này !"
          : error?.response?.data?.message;
      toast.error(`${err}`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      setSales({});
    }
  };

  const btnTable = () => {
    return (
      <div className="d-flex">
        <div className="me-3 d-flex align-items-end">
          <button
            className="btn btn-dark me-3"
            onClick={() => {
              navigate("/admin/products/sale/add");
            }}
          >
            Thêm mới <Plus weight="fill" />
          </button>
        </div>

        <div className="me-3">
          <label className="mb-2" htmlFor="">
            Từ ngày
          </label>

          <div style={{ position: "relative", display: "inline-block" }}>
            <DatePicker
              ref={startDatePickerRef}
              selected={startDate}
              onChange={setStartDate}
              dateFormat="dd/MM/yyyy"
              locale={vi} // Sử dụng locale tiếng Việt
              placeholderText="dd/mm/yyyy"
              className="form-control"
            />

            <CalendarBlank
              onClick={() => {
                startDatePickerRef.current.setFocus();
              }}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#666",
              }}
              size={19}
              weight="fill"
            />
          </div>
        </div>

        <div className="me-3">
          <label className="mb-2" htmlFor="">
            Đến ngày
          </label>

          <div style={{ position: "relative", display: "inline-block" }}>
            <DatePicker
              ref={endDatePickerRef}
              selected={endDate}
              onChange={setEndDate}
              dateFormat="dd/MM/yyyy"
              locale={vi} // Sử dụng locale tiếng Việt
              placeholderText="dd/mm/yyyy"
              className="form-control"
            />

            <CalendarBlank
              onClick={() => {
                endDatePickerRef.current.setFocus();
              }}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#666",
              }}
              size={19}
              weight="fill"
            />
          </div>
        </div>

        <div className="w-25">
          <label className="mb-2" htmlFor="">
            Trạng thái
          </label>

          <select
            className="form-select"
            id="exampleFormControlSelect1"
            onChange={(e) => {
              handleChangeSelectFilterActive(e.target.value);
              setStatus(e.target.value);
            }}
          >
            <option selected={status === -1} value="-1">
              Tất cả
            </option>
            <option selected={status === 2} value="2">
              Chưa bắt đầu
            </option>
            <option selected={status === 1} value="1">
              Đang diễn ra
            </option>
            <option selected={status === 3} value="3">
              Đang khóa
            </option>
            <option selected={status === 0} value="0">
              Đã kết thúc
            </option>
          </select>
        </div>
      </div>
    );
  };

  const onChangePagination = async (page) => {
    setLoading(true);

    const [error, data] = await stfExecAPI({
      url: `api/admin/sale/all?page=${page}&size=${8}&keyword=${
        keyword || ""
      }&startDate=${formatDateString(
        new Date(),
        "YYYY/MM/DD"
      )}&endDate=${formatDateString(
        new Date("2024-12-26"),
        "YYYY/MM/DD"
      )}&status=${status}`,
    });
    setLoading(false);
    if (data) {
      setSales(data.data);
    }
  };

  //*************** Các hàm xử lý logic********************
  const handleEdit = (record) => {
    navigate("/admin/products/new");
  };

  const handleDelete = (record) => {
    setSale({ ...record });
    setIsModalDeleteOpen(true);
  };

  const handleModalDeleteOk = async () => {
    //   const [error, data] = await stfExecAPI({
    //     method: "delete",
    //     url: `api/staff/suppliers?id=${supplier?.supplierId}`,
    //   });
    //   setLoading(false);
    //   if (error) {
    //     const err =
    //       error.status === 403
    //         ? "Bạn không có quyền để thực thi công việc này !"
    //         : error?.response?.data?.message;
    //     toast.error(`${err}`, {
    //       className: "toast-message",
    //       position: "top-right",
    //       autoClose: 5000,
    //     });
    //     return;
    //   }
    //   const fetchSuppliers = async () => {
    //     const [error, data] = await stfExecAPI({
    //       url: `api/staff/suppliers?size=${8}&page=${0}&status=true&keyword=`,
    //     });
    //     if (data) {
    //       setSuppliers(data.data);
    //     }
    //   };
    //   fetchSuppliers();
    //   toast.success(`Thành công`, {
    //     className: "toast-message",
    //     position: "top-right",
    //     autoClose: 5000,
    //   });
    //   setIsModalDeleteOpen(false);
  };

  const handleModalDeleteCancel = async () => {
    setSale({});
    setIsModalDeleteOpen(false);
  };

  // ********** Cấu hình table*********
  const columns = [
    {
      title: "Tên chương trình",
      dataIndex: "saleName",
      key: "saleName",
      render: (text, record) => {
        return (
          <span
            style={{
              color: "#6610f2",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => {
              navigate("/admin/products/sale/add", {
                state: { product: {} },
              });
            }}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: "Giảm giá",
      dataIndex: "percent",
      key: "percent",
      render: (text, record) => {
        return <p>{parseInt(text) + "%"}</p>;
      },
    },
    { title: "Thời gian bắt đầu", dataIndex: "startDate", key: "startDate" },
    { title: "Thời gian kết thúc", dataIndex: "endDate", key: "endDate" },
    {
      title: "Trạng thái",
      dataIndex: "active",
      key: "active",
      render: (text, record) => {
        if (text === 2) {
          return (
            <span
              className="badge bg-label-primary me-1"
              style={{ width: "110px" }}
            >
              Chưa bắt đầu
            </span>
          );
        } else if (text === 1) {
          return (
            <span
              class="badge bg-label-success me-1"
              style={{ width: "110px" }}
            >
              Đang diễn ra
            </span>
          );
        } else if (text === 3) {
          return (
            <span
              class="badge bg-label-warning me-1"
              style={{ width: "110px" }}
            >
              Đang khóa
            </span>
          );
        } else {
          return (
            <span class="badge bg-label-danger me-1" style={{ width: "110px" }}>
              Đã kết thúc
            </span>
          );
        }
      },
    },
    {
      title: "Hành Động",
      key: "actions",
      render: (text, record) => {
        return record.active !== 0 && record.active !== 2 ? (
          ""
        ) : (
          <div>
            <button
              className="btn btn-danger btn-sm me-4"
              onClick={() => handleDelete(record)}
            >
              <Trash weight="fill" />
            </button>
          </div>
        );
      },
      className: "center",
    },
  ];

  return (
    <>
      <FullScreenSpinner isLoading={loading} />

      <DataTableSft
        dataSource={sales?.content || []}
        columns={columns}
        title={"Danh sách chương trình giảm giá"}
        isSearch={true}
        onChangeSearch={onChangeInputSearch}
        keyword={keyword}
        buttonTable={btnTable()}
      />

      <div className="d-flex justify-content-end align-items-center mt-3">
        {/* <p className="me-3">Total 247 item</p> */}
        {sales.totalPages > 1 && (
          <PaginationSft
            count={sales.totalPages}
            defaultPage={(sales.number || 0) + 1}
            siblingCount={1}
            onPageChange={onChangePagination}
          />
        )}
      </div>

      {/* Modal xóa */}
      <ModalSft
        title="Xóa chương trình giảm giá"
        titleOk={"Xóa"}
        open={isModalDeleteOpen}
        onOk={handleModalDeleteOk}
        onCancel={handleModalDeleteCancel}
        size="modal-lg"
      >
        <span>Bạn có chắc muốn xóa?</span>
      </ModalSft>
    </>
  );
}

export default Sale;

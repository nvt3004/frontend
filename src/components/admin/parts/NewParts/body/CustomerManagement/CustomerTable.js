import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import PaginationSft from "../../../../PaginationSft";
import DataTableSft from "../../../../DataTableSft";
import ModalSft from "../../../../ModalSft";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import { stfExecAPI } from "../../../../../../stf/common";
import FullScreenSpinner from "../../../FullScreenSpinner";
import {  CalendarBlank } from "phosphor-react";

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

function formatDate(dateString, format) {
  const date = new Date(dateString);

  if (isNaN(date)) {
    return ""; // Nếu date không hợp lệ, trả về chuỗi rỗng
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  // Thay thế các ký tự định dạng
  return format.replace("DD", day).replace("MM", month).replace("YYYY", year);
}

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

const CustomerTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState({});
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState(1);
  const [reason, setReason] = useState("");
  const [isblock, setIsBlock] = useState(true);
  const [loading, setLoading] = useState(false);

  // ********** Cấu hình table*********
  const columns = [
    { title: "Tên Đăng Nhập", dataIndex: "username", key: "name" },
    { title: "Họ và tên", dataIndex: "fullname", key: "age" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Ngày sinh", dataIndex: "birthday", key: "birthday" },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (value, record) => {
        return value === 0 ? "" : value === 1 ? "Nam" : "Nữ";
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        if (text === 0) {
          return (
            <span class="badge bg-label-danger me-1" style={{ width: "80px" }}>
              Đã khóa
            </span>
          );
        } else {
          return (
            <span class="badge bg-label-success me-1" style={{ width: "80px" }}>
              Hoạt động
            </span>
          );
        }
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (text, record) => {
        return (
          <div>
            <button
              className={`btn ${
                record.status === 1 ? "btn-danger" : "btn-primary"
              } btn-sm`}
              onClick={() => handleDelete(record)}
            >
              {record.status === 1 ? "Khóa" : "Mở khóa"}
            </button>
          </div>
        );
      },
    },
  ];

  const btnTable = () => {
    return (
      <div className="d-flex">
        <select
          className="form-select w-25 mx-2"
          id="exampleFormControlSelect1"
          onChange={(e) => {
            handleChangeSelectFilterActive(e.target.value);
            setStatus(e.target.value);
          }}
        >
          <option value="1">Hoạt động</option>
          <option value="0">Đã khóa</option>
        </select>
      </div>
    );
  };

  // ********** Các hành động xử lý logic*********
  //Change trạng thái lọc
  const handleChangeSelectFilterActive = async (value) => {
    const fetchUsers = async () => {
      const [error, data] = await stfExecAPI({
        url: `api/admin/customer/all?page=${1}&size=${6}&keyword=${keyword}&status=${Number(
          value
        )}`,
      });

      if (data) {
        setUsers(data.data);
        return;
      }

      const err =
        error.status === 403
          ? "Account does not have permission to perform this function"
          : error?.response?.data?.message;

      toast.error(`${err}`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
    };

    fetchUsers();
  };

  //Nhấn nút delete
  const handleDelete = (record) => {
    setReason("");
    setIsBlock(record.status === 1);
    setIsModalDeleteOpen(true);
    setUser({ ...record });
  };

  //Modal xóa
  const handleModalDeleteOk = async () => {
    setLoading(true);

    const [error, data] = await stfExecAPI({
      method: "get",
      url: `api/admin/customer/delete?id=${user.userId}&reason=${reason}`,
    });

    if (error) {
      const err =
        error.status === 403
          ? "Account does not have permission to perform this function"
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
        url: `api/admin/customer/all?page=${1}&size=${6}&keyword=${""}&status=${1}`,
      });

      if (data) {
        setUsers(data.data);
      }
    };

    fetchUsers();

    toast.success(`Success!`, {
      className: "toast-message",
      position: "top-right",
      autoClose: 5000,
    });

    setLoading(false);
    setIsModalDeleteOpen(false); // Đóng modal khi nhấn "Save changes"
    setStatus(!isblock);
  };

  const handleModalDeleteCancel = () => {
    setIsModalDeleteOpen(false); // Đóng modal khi nhấn "Close"
  };

  //Đổ danh sách user
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const [error, data] = await stfExecAPI({
        url: `api/admin/customer/all?page=${1}&size=${6}&keyword=${""}&status=${1}`,
      });

      setLoading(false);
      if (data) {
        setUsers(data.data);
        return;
      }

      const err =
        error.status === 403
          ? "Account does not have permission to perform this function"
          : error?.response?.data?.message;

      toast.error(`${err}`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
    };

    fetchUsers();
  }, []);

  const onChangePagination = async (page) => {
    setLoading(true);

    const [error, data] = await stfExecAPI({
      url: `api/admin/customer/all?page=${page}&size=${6}&keyword=${
        keyword || ""
      }&status=${Number(status)}`,
    });

    if (data) {
      setUsers(data.data);
    }
    setLoading(false);
  };

  const onChangeInputSearch = async (value) => {
    setLoading(true);
    setKeyword(value);

    const [error, data] = await stfExecAPI({
      url: `api/admin/customer/all?page=${
        (users.number || 0) + 1
      }&size=${6}&keyword=${value}&status=${Number(status)}`,
    });

    if (data) {
      setUsers(data.data);
    } else {
      const err =
        error.status === 403
          ? "Account does not have permission to perform this function"
          : error?.response?.data?.message;

      toast.error(`${err}`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      setUser({});
    }
    setLoading(false);
  };


  return (
    <>
      <FullScreenSpinner isLoading={loading} />
      <DataTableSft
        dataSource={users?.content || []}
        columns={columns}
        title={"Danh sách khách hàng"}
        isSearch={true}
        onChangeSearch={onChangeInputSearch}
        keyword={keyword}
        buttonTable={btnTable()}
      />

      <div className="d-flex justify-content-end align-items-center mt-3">
        {/* <p className="me-3">Total 247 item</p> */}
        {users.totalPages > 1 && (
          <PaginationSft
            count={users.totalPages}
            defaultPage={(users.number || 0) + 1}
            siblingCount={1}
            onPageChange={onChangePagination}
          />
        )}
      </div>

      {/* Modal xóa */}
      <ModalSft
        title={isblock ? "Khóa tài khoản" : "Mở khóa tài khoản"}
        titleOk={"Ok"}
        open={isModalDeleteOpen}
        onOk={handleModalDeleteOk}
        onCancel={handleModalDeleteCancel}
        size="modal-lg"
      >
        {isblock ? (
          <div>
            <label for="" className="mb-2">
              Lý do
            </label>
            <textarea
              class="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
              value={reason}
              onInput={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do khóa"
            ></textarea>
          </div>
        ) : (
          "Bạn có chắc muốn mở cho khóa tài khoản này?"
        )}
      </ModalSft>
    </>
  );
};

export default CustomerTable;

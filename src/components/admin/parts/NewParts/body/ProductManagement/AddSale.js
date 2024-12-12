import React, { useEffect, useRef, useState } from "react";
import AvatarUpload from "../../../../AvatarUpload ";
import { stfExecAPI } from "../../../../../../stf/common";
import { toast } from "react-toastify";
import FullScreenSpinner from "../../../FullScreenSpinner";
import DataTableSft from "../../../../DataTableSft";
import ModalSft from "../../../../ModalSft";
import { TagsInput } from "react-tag-input-component";
import {
  Pencil,
  Trash,
  Plus,
  UserCirclePlus,
  CalendarBlank,
  MagnifyingGlass,
} from "phosphor-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import moment from "moment";
import Select from "react-select";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

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

function formatCurrencyVND(amount) {
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

const AddSale = () => {
  const [loading, setLoading] = useState(false);
  const [saleName, setSaleName] = useState("");
  const [percent, setPercent] = useState("");
  const [products, setProducts] = useState([]);
  const [versions, setVersions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const startDatePickerRef = useRef();
  const endDatePickerRef = useRef();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const currentDate = new Date(); // Lấy thời gian hiện tại
  const minTime = new Date(); // Giới hạn giờ bắt đầu từ hiện tại
  minTime.setMinutes(Math.floor(minTime.getMinutes() / 1) * 1); // Làm tròn đến 15 phút
  const maxTime = new Date(); // Giới hạn giờ tối đa trong ngày
  maxTime.setHours(23, 59, 59, 999); // Đặt maxTime là cuối ngày (23:59)

  //Đổ danh sách sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const [error, data] = await stfExecAPI({
        url: `api/staff/product/all`,
      });

      if (data) {
        setLoading(false);
        setProducts(data.data);
        return;
      }

      setLoading(false);
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

    fetchProducts();
  }, []);

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
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Giá gốc",
      dataIndex: "price",
      key: "price",
      render: (value, row) => {
        return formatCurrencyVND(value);
      },
    },
    {
      title: "Giảm",
      dataIndex: "reduce",
      key: "reduce",
      render: (value, row) => {
        return formatCurrencyVND(value);
      },
    },
    {
      title: "Còn lại",
      dataIndex: "total",
      key: "total",
      render: (value, row) => {
        return formatCurrencyVND(value);
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (text, record) => {
        return (
          <div>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => {}}
            >
              <Trash weight="fill" />
            </button>
          </div>
        );
      },
    },
  ];

  //Các hàm xử lý logic
  const handleOk = async () => {};

  const handleCancel = async () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <FullScreenSpinner isLoading={loading} />

      <form className="card p-4">
        <div className="row mb-3">
          <label>Thông tin chương trình giảm giá</label>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <div className="col-md-12">
              <label className="mb-2" htmlFor="basic-default-fullname">
                Tên chương trình <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="basic-default-fullname"
                placeholder="Nhập tên chương trình"
                value={saleName}
                onChange={(e) => setSaleName(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-6">
            <div className="col-md-12">
              <label className="mb-2" htmlFor="basic-default-fullname">
                Phần trăm giảm giá <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="basic-default-fullname"
                placeholder="Nhập phần trăm giảm giá giá trị từ 1 - 70 (%)"
                value={percent}
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^\d*$/.test(input)) {
                    const numericValue = Number(input);
                    if (numericValue >= 1 && numericValue <= 70) {
                      setPercent(input);
                    } else if (input === "") {
                      setPercent("");
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 col-12">
            <label className="mb-2" htmlFor="">
              Thời gian bắt đầu <span className="text-danger">*</span>
            </label>

            <div
              style={{
                position: "relative",
                display: "inline-block",
                width: "100%",
              }}
            >
              <DatePicker
                ref={startDatePickerRef}
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy HH:mm"
                locale={vi}
                placeholderText="dd/mm/yyyy HH:mm"
                className="form-control"
                showTimeSelect
                timeIntervals={1}
                timeCaption="Giờ"
                style={{ width: "100%" }}
                minDate={currentDate}
                minTime={minTime} // Giới hạn giờ bắt đầu từ giờ hiện tại
                maxTime={maxTime} // Giới hạn giờ tối đa là 23:59
              />

              <CalendarBlank
                onClick={() => startDatePickerRef.current.setFocus()}
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

          <div className="col-md-6 col-12">
            <label className="mb-2" htmlFor="">
              Thời gian kết thúc <span className="text-danger">*</span>
            </label>

            <div
              style={{
                position: "relative",
                display: "inline-block",
                width: "100%",
              }}
            >
              <DatePicker
                ref={endDatePickerRef}
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy HH:mm"
                locale={vi}
                placeholderText="dd/mm/yyyy HH:mm"
                className="form-control"
                showTimeSelect
                timeIntervals={1}
                timeCaption="Giờ"
                style={{ width: "100%" }}
                minDate={currentDate}
                minTime={minTime} // Giới hạn giờ bắt đầu từ giờ hiện tại
                maxTime={maxTime} // Giới hạn giờ tối đa là 23:59
              />

              <CalendarBlank
                onClick={() => endDatePickerRef.current.setFocus()}
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
        </div>
      </form>

      <form className="card p-4 mt-3">
        <div className="d-flex mb-3">
          <button
            type="button"
            className="btn btn-dark me-3"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Chọn sản phẩm <Plus weight="fill" />
          </button>
        </div>

        <div className="row mb-4">
          <div
            className="col-12"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <DataTableSft
              dataSource={versions || []}
              columns={columns}
              title={"Sản Phẩm"}
            />
          </div>
        </div>
      </form>

      <ModalSft
        title="Thông tin sản phẩm"
        titleOk={"Áp dụng"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        size="modal-lg"
      >
        <div className="p-2">
          <div className="input-group input-group-merge">
            <span className="input-group-text" id="basic-addon-search31">
              <MagnifyingGlass />
            </span>
            <input
              // onChange={handleSearch} // Sử dụng hàm handleSearch thay vì onChangeSearch trực tiếp
              // value={searchQuery} // Hiển thị giá trị keyword trong input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm sản phẩm"
              aria-label="Tìm kiếm sản phẩm"
              aria-describedby="basic-addon-search31"
            />
          </div>

          <div
            style={{
              maxHeight: "400px",
              minHeight: "400px",
              overflowY: "auto",
            }}
          ></div>
        </div>
      </ModalSft>
    </>
  );
};

export default AddSale;

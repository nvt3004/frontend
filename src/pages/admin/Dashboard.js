import React from "react";
import { useEffect, useState, useRef } from "react";
import { ShoppingCart, Money, CreditCard, CalendarBlank } from "phosphor-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
import moment from "moment";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { stfExecAPI } from "../../stf/common";
import { toast } from "react-toastify";

function formatNumberWithCommas(number) {
  if (typeof number !== "number") {
    throw new Error("Input must be a number");
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true, // Đảm bảo biểu đồ sẽ tự động thay đổi kích thước
  plugins: {
    legend: {
      position: "bottom",
    },
    title: {
      display: true,
      text: "",
    },
  },
  maintainAspectRatio: false, // Cho phép thay đổi tỷ lệ khung hình
};

function formatCurrencyVND(amount) {
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
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

function Dashboard() {
  const [reportQuantityProduct, setReportQuantityProduct] = useState(0);
  const [reportRevenue, setReportRevenue] = useState(0);
  const [reportProfit, setReportProfit] = useState(0); // Là tổng số đơn hàng
  const startDatePickerRef = useRef();
  const endDatePickerRef = useRef();
  const [startDate, setStartDate] = useState(
    formatDateString(new Date(), "YYYY/MM/DD")
  );
  const [endDate, setEndDate] = useState(
    formatDateString(new Date(), "YYYY/MM/DD")
  );
  const [productStock, setProductStock] = useState([]);
  const [productBetSaler, setProductBetSaler] = useState([]);

  //Tính doanh thu
  useEffect(() => {
    const fetchUsers = async () => {
      // setLoading(true);
      const [error, data] = await stfExecAPI({
        url: `api/admin/report/revenue?startDate=${moment(startDate).format(
          "YYYY/MM/DD"
        )}&endDate=${moment(endDate).format("YYYY/MM/DD")}`,
      });

      if (data) {
        // setLoading(false);
        setReportRevenue(data.data);
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

      // setLoading(false);
    };

    fetchUsers();
  }, [startDate, endDate]);

  //Tính sản phẩm đã bán
  useEffect(() => {
    const fetchUsers = async () => {
      // setLoading(true);
      const [error, data] = await stfExecAPI({
        url: `api/admin/report/total-product-buy?startDate=${moment(
          startDate
        ).format("YYYY/MM/DD")}&endDate=${moment(endDate).format(
          "YYYY/MM/DD"
        )}`,
      });

      if (data) {
        // setLoading(false);
        setReportQuantityProduct(data.data);
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

      // setLoading(false);
    };

    fetchUsers();
  }, [startDate, endDate]);

  //Tính tổng số đơn hàng
  useEffect(() => {
    const fetchUsers = async () => {
      // setLoading(true);
      const [error, data] = await stfExecAPI({
        url: `api/admin/report/total-order?startDate=${moment(startDate).format(
          "YYYY/MM/DD"
        )}&endDate=${moment(endDate).format("YYYY/MM/DD")}&statusId=${-1}`,
      });

      if (data) {
        setReportProfit(data.data);
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
  }, [startDate, endDate]);

  //Tính top 5 sản phẩm bán chạy nhất
  useEffect(() => {
    const fetchUsers = async () => {
      const [error, data] = await stfExecAPI({
        url: `api/admin/report/product-betsaler?startDate=${moment(
          startDate
        ).format("YYYY/MM/DD")}&endDate=${moment(endDate).format(
          "YYYY/MM/DD"
        )}`,
      });

      if (data) {

        const dat = {
          labels: data?.data?.map((i) => i.versionName) || [],
          datasets: [
            {
              label: "Số lượng sản phẩm",
              data: data?.data?.map((i) => i.quantity),
              backgroundColor: "#233446",
            },
          ],
        };
        setProductBetSaler(dat);
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
  }, [startDate,endDate]);

  //Tính top 5 sản phẩm tồn kho
  useEffect(() => {
    const fetchUsers = async () => {
      // setLoading(true);
      const [error, data] = await stfExecAPI({
        url: `api/admin/report/top-inventory`,
      });

      if (data) {
        // setLoading(false);

        const dat = {
          labels: data?.data?.map((i) => i.versionName) || [],
          datasets: [
            {
              label: "Số lượng sản phẩm",
              data: data?.data?.map((i) => i.quantity),
              backgroundColor: "#233446",
            },
          ],
        };
        setProductStock(dat);
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

      // setLoading(false);
    };

    fetchUsers();
  }, []);

  console.log(productStock);
  return (
    <>
      <div className="row">
        <div class="col-md-4 col-1">
          <div className="card">
            <div class="card-body">
              <div className="d-flex align-items-center">
                <ShoppingCart weight="fill" size={50} className="me-4" />
                <div className="">
                  <h5 class="card-title">Sản phẩm đã bán</h5>
                  <h6 class="card-title text-primary">
                    {formatNumberWithCommas(reportQuantityProduct)}
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4 col-1">
          <div className="card">
            <div class="card-body">
              <div className="d-flex align-items-center">
                <Money weight="fill" size={50} className="me-4" />
                <div className="">
                  <h5 class="card-title">Doanh thu</h5>
                  <h6 class="card-title text-primary">
                    {formatCurrencyVND(reportRevenue)}
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-4 col-1">
          <div className="card">
            <div class="card-body">
              <div className="d-flex align-items-center">
                <CreditCard weight="fill" size={50} className="me-4" />
                <div className="">
                  <h5 class="card-title">Tổng số đơn hàng</h5>
                  <h6 class="card-title text-primary">
                    {formatNumberWithCommas(reportProfit)}
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex mt-4 bg-white p-4 rounded-2 align-items-center">
        <div className="me-3">
          <label className="mb-2" htmlFor="basic-default-birthday">
            Lọc theo
          </label>

          <select
            className="form-select"
            id="exampleFormControlSelect1"
            onChange={(e) => {
              // handleChangeSelectFilterActive(e.target.value);
              // setStatus(e.target.value);
            }}
          >
            <option value="0">Hôm nay</option>
            <option value="1">Hôm qua</option>
            <option value="2">Tuần này</option>
            <option value="3">Tuần trước</option>
            <option value="4">Tháng này</option>
            <option value="5">Tháng trước</option>
            <option value="6">Năm nay</option>
            <option value="7">Năm trước</option>
            <option value="7">Tùy chọn</option>
          </select>
        </div>

        <div className="me-3">
          <label className="mb-2" htmlFor="basic-default-birthday">
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

        <div>
          <label className="mb-2" htmlFor="basic-default-birthday">
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
      </div>

      <div className="card mt-4 p-4" style={{ height: "400px", width: "100%" }}>
        <h5 className="card-title mb-3">Top 5 sản phẩm bán chạy</h5>
        {productBetSaler.labels && <Bar options={options} data={productBetSaler} />}
      </div>

      <div className="card mt-4 p-4" style={{ height: "400px", width: "100%" }}>
        <h5 className="card-title mb-3">Top 5 sản phẩm tồn kho nhiều nhất</h5>
        {productStock.labels && <Bar options={options} data={productStock} />}
      </div>
    </>
  );
}

export default Dashboard;

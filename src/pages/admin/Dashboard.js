import React from "react";
import { useEffect, useState, useRef } from "react";
import {
  ShoppingCart,
  Money,
  CreditCard,
  CalendarBlank,
  Heart,
  Clock, //Chờ xử lý
  Prohibit, //Đã xử lý
  Truck, //Đã giao
  Package, //Đã nhận,
  XCircle, //Đã hủy
} from "phosphor-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getProfile } from "../../services/api/OAuthApi";
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

function getStartAndEndDate(value) {
  const today = new Date();
  let startDate, endDate;

  switch (value) {
    case "0": // Hôm nay
      startDate = endDate = formatDateVn(today);
      break;

    case "1": // Hôm qua
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      startDate = endDate = formatDateVn(yesterday);
      break;

    case "2": // Tuần này
      const startOfWeek = new Date(today);
      const endOfWeek = new Date(today);

      // Tìm Thứ Hai đầu tuần
      startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));
      // Tìm Chủ Nhật cuối tuần
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      startDate = formatDateVn(startOfWeek);
      endDate = formatDateVn(endOfWeek);
      break;

    case "3": // Tuần trước
      const startOfLastWeek = new Date(today);
      const endOfLastWeek = new Date(today);

      // Tìm Thứ Hai tuần trước
      startOfLastWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7) - 7);
      // Tìm Chủ Nhật tuần trước
      endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);

      startDate = formatDateVn(startOfLastWeek);
      endDate = formatDateVn(endOfLastWeek);
      break;

    case "4": // Tháng này
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      startDate = formatDateVn(startOfMonth);
      endDate = formatDateVn(today);
      break;

    case "5": // Tháng trước
      const startOfLastMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
      );
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Ngày cuối tháng trước
      startDate = formatDateVn(startOfLastMonth);
      endDate = formatDateVn(endOfLastMonth);
      break;

    case "6": // Năm nay
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      startDate = formatDateVn(startOfYear);
      endDate = formatDateVn(today);
      break;

    case "7": // Năm trước
      const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
      const endOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
      startDate = formatDateVn(startOfLastYear);
      endDate = formatDateVn(endOfLastYear);
      break;

    default: // Tùy chọn (hoặc giá trị không xác định)
      startDate = endDate = null;
  }

  return { startDate, endDate };
}

// Hàm định dạng ngày thành chuỗi yyyy/mm/dd
function formatDateVn(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // Tháng (0-based)
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd}`;
}

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
  const [reportDonChoXuLy, setReportDonChoXuLy] = useState(0);
  const [reportDonDaGiao, setReportDonDaGiao] = useState(0);
  const [reportDonDaNhan, setReportDaNhan] = useState(0);
  const [reportDonDaHuy, setReportDaHuy] = useState(0);
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
  const [productFavorites, setProductFavorites] = useState([]);
  const [showDate, setShowDate] = useState(false);
  const [profile, setProfile] = useState();

  useEffect(() => {
    const fetchProfile = async () => {
      const { listData } = await getProfile();

      setProfile(listData);
    };

    fetchProfile();
  }, []);

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
    };

    fetchUsers();
  }, [startDate, endDate]);

  //Tính tổng số đơn hàng
  useEffect(() => {
    const fetchUsers = async () => {
      // setLoading(true);
      const [error, data] = await stfExecAPI({
        url: `api/admin/report/revenue?startDate=${moment(startDate).format(
          "YYYY/MM/DD"
        )}&endDate=${moment(endDate).format("YYYY/MM/DD")}&statusId=${-1}`,
      });

      if (data) {
        setReportRevenue(data.data);
        return;
      }
    };

    fetchUsers();
  }, [startDate, endDate]);


  //Tính tổng số đơn hàng chờ xử lý
  useEffect(() => {
    const fetchUsers = async () => {
      // setLoading(true);
      const [error, data] = await stfExecAPI({
        url: `api/admin/report/total-order?startDate=${moment(startDate).format(
          "YYYY/MM/DD"
        )}&endDate=${moment(endDate).format("YYYY/MM/DD")}&statusId=${1}`,
      });

      if (data) {
        setReportDonChoXuLy(data.data);
        return;
      }
    };

    fetchUsers();
  }, [startDate, endDate]);

  //Tính tổng số đơn hàng đã giao
  useEffect(() => {
    const fetchUsers = async () => {
      // setLoading(true);
      const [error, data] = await stfExecAPI({
        url: `api/admin/report/total-order?startDate=${moment(startDate).format(
          "YYYY/MM/DD"
        )}&endDate=${moment(endDate).format("YYYY/MM/DD")}&statusId=${3}`,
      });

      if (data) {
        setReportDonDaGiao(data.data);
        return;
      }
    };

    fetchUsers();
  }, [startDate, endDate]);

  //Tính tổng số đơn hàng đã nhận
  useEffect(() => {
    const fetchUsers = async () => {
      // setLoading(true);
      const [error, data] = await stfExecAPI({
        url: `api/admin/report/total-order?startDate=${moment(startDate).format(
          "YYYY/MM/DD"
        )}&endDate=${moment(endDate).format("YYYY/MM/DD")}&statusId=${4}`,
      });

      if (data) {
        setReportDaNhan(data.data);
        return;
      }
    };

    fetchUsers();
  }, [startDate, endDate]);

  //Tính tổng số đơn hàng đã hủy
  useEffect(() => {
    const fetchUsers = async () => {
      // setLoading(true);
      const [error, data] = await stfExecAPI({
        url: `api/admin/report/total-order?startDate=${moment(startDate).format(
          "YYYY/MM/DD"
        )}&endDate=${moment(endDate).format("YYYY/MM/DD")}&statusId=${5}`,
      });

      if (data) {
        setReportDaHuy(data.data);
        return;
      }
    };

    fetchUsers();
  }, [startDate, endDate]);

  //Tính top 5 sản phẩm yêu thích nhất
  useEffect(() => {
    const fetchUsers = async () => {
      // setLoading(true);
      const [error, data] = await stfExecAPI({
        url: `api/admin/report/product-favorite`,
      });

      if (data) {
        // setLoading(false);
        setProductFavorites(data.data);
        return;
      }

      setProductFavorites([]);
    };

    fetchUsers();
  }, []);

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
    };

    fetchUsers();
  }, [startDate, endDate]);

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
    };

    fetchUsers();
  }, []);

  console.log(productStock);

  return profile?.authorities[0]?.authority !== "Admin" ? (
    <h6>Bạn có thể sử dụng các chức năng ở menu bên trái!</h6>
  ) : (
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
              const { startDate, endDate } = getStartAndEndDate(e.target.value);

              if (startDate && endDate) {
                setStartDate(new Date(startDate));
                setEndDate(new Date(endDate));
                setShowDate(false);
              } else {
                setShowDate(true);
              }
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
            <option value="8">Tùy chọn</option>
          </select>
        </div>

        {showDate && (
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
        )}

        {showDate && (
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
        )}
      </div>
      {/* style={{ height: "400px" }} */}
      <div className="mt-4">
        <div className="row">
          <div className="col-6 bg-white p-4 rounded-2 mx-3">
            <h5 className="card-title mb-3">
              Sản phẩm được yêu thích nhiều nhất
            </h5>

            <div className="table-responsive text-nowrap">
              <table className="table">
                <tbody className="table-border-bottom-0">
                  {productFavorites &&
                    productFavorites.map((pd) => {
                      return (
                        <tr key={pd.image}>
                          <td>
                            <div className="d-flex align-items-center">
                              <ul className="list-unstyled users-list avatar-group d-flex align-items-center me-3">
                                <li
                                  data-bs-toggle="tooltip"
                                  data-popup="tooltip-custom"
                                  data-bs-placement="top"
                                  className="avatar avatar-xs pull-up"
                                  title="Lilian Fuller"
                                >
                                  <img
                                    src={pd.image}
                                    alt="Avatar"
                                    className="rounded-circle"
                                  />
                                </li>
                              </ul>
                              <span className="mx-4"> {pd.productName}</span>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="me-2">
                                {formatNumberWithCommas(pd.like || 0)}
                              </span>
                              <Heart
                                className="text-danger"
                                weight="fill"
                                size={25}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-5 bg-white p-4 rounded-2">
            <h5 className="card-title mb-3">Đơn hàng</h5>

            <div>
              <ul class="p-0 m-0">
                <li class="d-flex mb-4 pb-1">
                  <div class="avatar flex-shrink-0 me-3">
                    <Clock className="text-warning" weight="fill" size={34} />
                  </div>

                  <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                    <div class="me-2">
                      {/* <small class="text-muted d-block mb-1">Paypal</small> */}
                      <h6 class="mb-0">Chờ xử lý</h6>
                    </div>
                    <div class="user-progress d-flex align-items-center gap-1">
                      <h6 class="mb-0">
                        {formatNumberWithCommas(reportDonChoXuLy || 0)}
                      </h6>
                    </div>
                  </div>
                </li>

                <li class="d-flex mb-4 pb-1">
                  <div class="avatar flex-shrink-0 me-3">
                    <Truck className="text-primary" weight="fill" size={34} />
                  </div>

                  <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                    <div class="me-2">
                      {/* <small class="text-muted d-block mb-1">Paypal</small> */}
                      <h6 class="mb-0">Đã giao</h6>
                    </div>
                    <div class="user-progress d-flex align-items-center gap-1">
                      <h6 class="mb-0">
                        {formatNumberWithCommas(reportDonDaGiao || 0)}
                      </h6>
                    </div>
                  </div>
                </li>

                <li class="d-flex mb-4 pb-1">
                  <div class="avatar flex-shrink-0 me-3">
                    <Package className="text-success" weight="fill" size={34} />
                  </div>
                  <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                    <div class="me-2">
                      {/* <small class="text-muted d-block mb-1">Paypal</small> */}
                      <h6 class="mb-0">Đã nhận</h6>
                    </div>
                    <div class="user-progress d-flex align-items-center gap-1">
                      <h6 class="mb-0">
                        {formatNumberWithCommas(reportDonDaNhan || 0)}
                      </h6>
                    </div>
                  </div>
                </li>

                <li class="d-flex mb-4 pb-1">
                  <div class="avatar flex-shrink-0 me-3">
                    <Prohibit className="text-danger" weight="fill" size={34} />
                  </div>

                  <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
                    <div class="me-2">
                      {/* <small class="text-muted d-block mb-1">Paypal</small> */}
                      <h6 class="mb-0">Đã hủy</h6>
                    </div>
                    <div class="user-progress d-flex align-items-center gap-1">
                      <h6 class="mb-0">
                        {formatNumberWithCommas(reportDonDaHuy || 0)}
                      </h6>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4 p-4" style={{ height: "400px", width: "100%" }}>
        <h5 className="card-title mb-3">Top sản phẩm bán chạy</h5>
        {productBetSaler.labels && (
          <Bar options={options} data={productBetSaler} />
        )}
      </div>

      <div className="card mt-4 p-4" style={{ height: "400px", width: "100%" }}>
        <h5 className="card-title mb-3">Top sản phẩm tồn kho nhiều nhất</h5>
        {productStock.labels && <Bar options={options} data={productStock} />}
      </div>
    </>
  );
}

export default Dashboard;

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import Avatar from "../../assets/images/userDefaut.jpg";
import {
  getAllProvince,
  getAllDistrictByProvince,
  getAllWardByDistrict,
} from "../../services/api/ghnApi";

import { useForm } from "react-hook-form";
import { stfExecAPI } from "../../stf/common";
import DangerAlert from "../../components/client/sweetalert/DangerAlert";
import SuccessAlert from "../../components/client/sweetalert/SuccessAlert";
import ConfirmAlert from "../../components/client/sweetalert/ConfirmAlert";
import { getProfile, updateUser } from "../../services/api/OAuthApi";
import { format } from "date-fns";
import moment from "moment";
import productApi from "../../services/api/ProductApi";
function getNameAddress(nameId) {
  return nameId.substring(nameId.indexOf(" "), nameId.length).trim();
}
function getIdAddress(name) {
  return name.substring(0, name.indexOf(" ")).trim();
}
const Account = () => {
  const [showToast, setShowToast] = useState(false);
  const couponRefs = useRef([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [wards, setWards] = useState([]);

  const [provinceId, setProvinceId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [wardId, setWardId] = useState("");

  const [errPro, setErrPro] = useState();
  const [errDis, setErrDis] = useState();
  const [errWar, setErrWar] = useState();
  const [errDetail, setErrDetail] = useState();

  const [addressDetal, setAddressDetal] = useState("");

  const [idEdit, setIdEdit] = useState(-1);

  const [profile, setProfile] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0); // Quản lý trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyWord] = useState(""); // Từ khóa tìm kiếm
  const [statusId, setStatusId] = useState(null); // Trạng thái đơn hàng

  const [status, setStatus] = useState([]); // Trạng thái đơn hàng

  const fetchStatus = async () => {
    try {
      const data = await productApi.getOrderStatus();
      setStatus(data.data);
    } catch (error) {
      console.error("Error fetching order status:", error);
    }
  };

  // Hàm gọi API getOrder
  const fetchOrders = async (pageNumber = 0) => {
    if (pageNumber < 0) return; // Bảo vệ pageNumber
    setLoading(true);
    try {
      const data = await productApi.getOrder(keyword, statusId, 10, pageNumber); // Gọi API getOrder với page

      setOrders(data.content || []); // Lưu danh sách đơn hàng
      setTotalPages(data.totalPages || 1); // Lưu tổng số trang
      setPage(data.number || 0); // Lưu trang hiện tại
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component được render lần đầu tiên hoặc khi keyword/statusId thay đổi
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStatus();
      fetchOrders();
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword, statusId]);

  // Hàm xử lý khi người dùng chuyển trang
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchOrders(newPage); // Gọi API với trang mới
    }
  };

  useEffect(() => {
    if (profile && profile.listData) {
      setFormData({
        fullName: profile.listData.fullName || "",
        email: profile.listData.email || "",
        phone: profile.listData.phone || "",
      });
      setGender(
        profile.listData.gender === 1
          ? "Male"
          : profile.listData.gender === 0
          ? "Female"
          : "Other"
      );
      setBirthday(
        profile.listData.birthday ? profile.listData.birthday.split("T")[0] : ""
      );
    }
  }, [profile]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedUser = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      gender: gender === "Male" ? 1 : gender === "Female" ? 0 : 2,
      birthday: birthday
        ? new Date(birthday).toISOString().split("T")[0]
        : null,
      image: selectedImage || profile?.listData?.image,
    };

    try {
      const response = await updateUser(profile.listData.userId, updatedUser);
      console.log("Update successful:", response);
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Lấy file đầu tiên trong danh sách
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result); // Lưu đường dẫn hình ảnh vào state
      };
      reader.readAsDataURL(file); // Đọc file dưới dạng URL
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();

        console.log("Profile data:", profileData);
        setProfile(profileData);
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile && profile.listData) {
      if (profile.listData.birthday) {
        // Giả sử birthday là kiểu Date hoặc chuỗi ngày hợp lệ
        const date = new Date(profile.listData.birthday);
        const formattedDate = date.toISOString().split("T")[0]; // Chuyển đổi thành định dạng YYYY-MM-DD
        setBirthday(formattedDate);
      }
    }
  }, [profile]); // Chạy effect khi profile thay đổi

  const handleBirthdayChange = (event) => {
    console.log("ngay sinh" + event.target.value);
    setBirthday(event.target.value);
  };

  useEffect(() => {
    if (profile && profile.listData && profile.listData.gender !== undefined) {
      const genderValue = profile.listData.gender;
      if (genderValue === 1) {
        setGender("Male");
      } else if (genderValue === 0) {
        setGender("Female");
      } else {
        setGender("Other");
      }
    }
  }, [profile]);

  //Lưu địa chỉ
  const handleSaveAddress = async () => {
    if (!validate()) {
      return;
    }

    const pro = JSON.parse(provinceId);
    const dis = JSON.parse(districtId);
    const war = JSON.parse(wardId);

    //Thực hiện thêm nếu mở modal mà id là -1, ngược lại cập nhật
    if (idEdit === -1) {
      await handleAddAddress(pro, dis, war);
    } else {
      await handleUpdateAddress(pro, dis, war);
    }

    const [error, data] = await stfExecAPI({
      url: "api/user/address/get-all",
    });

    if (data) {
      setAddresses([...data?.data]);
    }
  };

  //Thêm địa chỉ
  const handleAddAddress = async (pro, dis, war) => {
    const [error, data] = await stfExecAPI({
      method: "post",
      url: "api/user/address/add",
      data: {
        province: `${pro.ProvinceID} ${pro.NameExtension[1]}`,
        district: `${dis.DistrictID} ${dis.DistrictName}`,
        ward: `${war.WardCode} ${war.WardName}`,
        detailAddress: addressDetal,
      },
    });

    if (error) {
      DangerAlert({
        text: `${error?.code}: ${error?.message}` || "Server error",
      });
      return;
    }
    SuccessAlert({
      text: "Add address success!",
    });
  };

  //Sửa địa chỉ
  const handleUpdateAddress = async (pro, dis, war) => {
    const [error, data] = await stfExecAPI({
      method: "put",
      url: "api/user/address/update",
      data: {
        addressId: idEdit,
        province: `${pro.ProvinceID} ${pro.NameExtension[1]}`,
        district: `${dis.DistrictID} ${dis.DistrictName}`,
        ward: `${war.WardCode} ${war.WardName}`,
        detailAddress: addressDetal,
      },
    });

    if (error) {
      DangerAlert({
        text: `${error?.code}: ${error?.message}` || "Server error",
      });
      return;
    }
    SuccessAlert({
      text: "Update address success!",
    });
  };

  //Xóa địa chỉ
  const handleDeleteAddress = async (addressId) => {
    const isDelete = await ConfirmAlert({
      title: "Delete address",
      text: "Are you sure you want to delete?",
      cancelText: "Cancel",
      confirmText: "Delete",
    });

    if (!isDelete) return;

    const [error, data] = await stfExecAPI({
      method: "delete",
      url: `api/user/address/remove/${addressId}`,
    });

    if (error) {
      DangerAlert({
        text:
          `${error?.response?.data?.code}: ${error?.response?.data?.message}` ||
          "Server error",
      });
      return;
    }

    const fetchDataAddress = async () => {
      const [error, data] = await stfExecAPI({
        url: "api/user/address/get-all",
      });

      if (data) {
        setAddresses([...data?.data]);
      }
    };

    fetchDataAddress();

    SuccessAlert({
      text: "Delete address success!",
    });
  };

  //Bắt lỗi form nhập địa chỉ
  const validate = () => {
    let isError = false;

    if (provinceId.trim().length === 0) {
      setErrPro(true);
      isError = true;
    } else {
      setErrPro(false);
    }

    if (districtId.trim().length === 0) {
      setErrDis(true);
      isError = true;
    } else {
      setErrDis(false);
    }

    if (wardId.trim().length === 0) {
      setErrWar(true);
      isError = true;
    } else {
      setErrWar(false);
    }

    if (addressDetal.trim().length === 0) {
      setErrDetail(true);
      isError = true;
    } else {
      setErrDetail(false);
    }

    return !isError;
  };

  //Đổ dữ liệu địa chỉ của user
  useEffect(() => {
    const fetchDataAddress = async () => {
      const [error, data] = await stfExecAPI({
        url: "api/user/address/get-all",
      });

      if (data) {
        setAddresses([...data?.data]);
      }
    };

    fetchDataAddress();
  }, []);

  //Đổ dữ liệu tỉnh thành
  useEffect(() => {
    const fetchProvinces = async () => {
      const provincesData = await getAllProvince();

      setProvinces(provincesData);
    };

    fetchProvinces();
  }, []);

  //Đổ dữ liệu huyện dựa vào tỉnh thành
  useEffect(() => {
    const fetchDistricts = async () => {
      if (provinceId !== "") {
        const districtsData = await getAllDistrictByProvince(
          JSON.parse(provinceId).ProvinceID
        );

        setDistricts(districtsData);

        if (idEdit !== -1) {
          const disName = addresses.find(
            (a) => a.addressId === idEdit
          )?.district;

          setDistrictId(
            JSON.stringify(
              districtsData.find((d) => d.DistrictID == getIdAddress(disName))
            )
          );
        } else {
          setDistrictId(JSON.stringify(districtsData[0]));
        }
      }
    };

    fetchDistricts();
  }, [provinceId]);

  //Đổ dữ liệu xã dựa vào huyện
  useEffect(() => {
    const fetchWards = async () => {
      if (districtId !== "") {
        const warData = await getAllWardByDistrict(
          JSON.parse(districtId).DistrictID
        );

        setWards(warData);

        if (idEdit !== -1) {
          const disName = addresses.find((a) => a.addressId === idEdit)?.ward;

          setWardId(
            JSON.stringify(
              warData.find((d) => d.WardCode == getIdAddress(disName))
            )
          );
          console.log(
            "Ward: ",
            warData.find((d) => d.WardCode == getIdAddress(disName))
          );
        } else {
          setWardId(JSON.stringify(warData[0]));
        }
      }
    };

    fetchWards();
  }, [districtId, provinceId]);

  const styles = {
    container: {
      minHeight: "90vh",
    },
    accountImg: {
      width: "200px",
      height: "200px",
      borderRadius: "50%",
      objectFit: "cover",
      marginBottom: "20px",
    },
    accountImg1: {
      width: "70px",
      height: "70px",
      borderRadius: "50%",
      objectFit: "cover",
      marginBottom: "20px",
    },
    bor8: {
      borderRadius: "8px",
    },
    stext111: {
      fontSize: "16px",
    },
    size111: {
      height: "48px",
    },
    pLr15: {
      paddingLeft: "15px",
      paddingRight: "15px",
    },
    mB12: {
      marginBottom: "12px",
    },
    genderContainer: {
      borderRadius: "8px",
      backgroundColor: "#f0f0f0",
      marginBottom: "12px",
      padding: "5px",
    },
  };
  function formatCurrencyVND(amount) {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }
  return (
    <div
      className="container mt-5 pt-5 d-flex justify-content-center"
      style={styles.container}
    >
      <div className="w-full">
        <div className="d-flex align-items-center bg-white shadow-sm rounded p-3 mb-4">
          <div>
            <img
              src={profile?.listData?.image || Avatar}
              alt="User Avatar"
              className="rounded-circle me-3"
              style={{ width: "80px", height: "80px", objectFit: "cover" }}
            />
          </div>
          <div>
            <h4 className="fw-bold mb-1">
              {profile?.listData?.fullName || "Your Name"}
            </h4>
            <p className="text-muted mb-0">
              {profile?.listData?.provider === "Guest"
                ? profile.listData.username
                : "Social"}
            </p>
          </div>
          <div className="ms-auto d-flex flex-column flex-md-row align-items-center">
            <button
              type="button"
              className="btn btn-outline-secondary d-flex align-items-center justify-content-center me-md-3 mb-2 mb-md-0"
              style={{ height: "40px", padding: "0 15px" }}
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              <i className="zmdi zmdi-edit me-2"></i>
              Edit
            </button>

            {/* Uncomment if Address button is needed */}
            {/* <button
      type="button"
      className="btn btn-outline-primary d-flex align-items-center justify-content-center"
      style={{ height: "40px", padding: "0 15px" }}
      data-bs-toggle="modal"
      data-bs-target="#exampleModal9"
    >
      <i className="zmdi zmdi-pin me-2"></i>
      Address
    </button> */}
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-md-8">
            {/* Header */}
            <div className="row align-items-center mb-3">
              <div className="col-auto">
                <h4 className="fw-bold">Orders</h4>
              </div>

              {/* Input tìm kiếm */}
              <div className="col">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search orders..."
                  value={keyword}
                  onChange={(e) => setKeyWord(e.target.value)}
                />
              </div>

              {/* Dropdown trạng thái */}
              <div className="col-auto">
                <select
                  className="form-select"
                  value={statusId || ""}
                  onChange={(e) =>
                    setStatusId(
                      e.target.value ? parseInt(e.target.value, 10) : null
                    )
                  }
                >
                  <option value="">All Statuses</option>
                  {status?.map((item) => (
                    <option key={item.statusId} value={item.statusId}>
                      {item.statusName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Danh sách đơn hàng */}
            <div className="overflow-auto" style={{ maxHeight: "60vh" }}>
              {orders?.length === 0 ? (
                <div className="text-center py-3 text-muted">
                  No orders found
                </div>
              ) : (
                orders?.map((order) => (
                  <div key={order.orderId} className="mb-3">
                    <div className="card border-0 shadow-lg hover-shadow-lg">
                      <div
                        className="card-header bg-white d-flex justify-content-between align-items-center p-3 rounded-3"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapseOrder${order.orderId}`}
                        aria-expanded="false"
                        aria-controls={`collapseOrder${order.orderId}`}
                        role="button"
                        style={{ cursor: "pointer" }}
                      >
                        <div>
                          <strong className="text-dark">
                            Order #{order.orderId}
                          </strong>
                          <br />
                          <small className="text-muted">
                            {moment(order?.orderDate)
                              .subtract(7, "hours")
                              .format("DD/MM/YYYY HH:mm")}
                          </small>
                        </div>

                        {/* Trạng thái đơn hàng */}
                        <span
                          className={`badge bg-${
                            order.statusName === "Shipped"
                              ? "success"
                              : order.statusName === "Processed"
                              ? "info"
                              : order.statusName === "Pending"
                              ? "warning"
                              : order.statusName === "Delivered"
                              ? "primary"
                              : order.statusName === "Cancelled"
                              ? "danger"
                              : "secondary"
                          } text-white`}
                          style={{ fontSize: "12px", fontWeight: "bold" }}
                        >
                          {order.statusName}
                        </span>

                        {/* Tổng tiền đơn hàng */}
                        <div>
                          <strong className="text-dark">
                            Total:{" "}
                            {formatCurrencyVND(order.totalPrice ?? "N/A")}
                          </strong>
                        </div>
                      </div>

                      {/* Chi tiết đơn hàng */}
                      <div
                        className="collapse"
                        id={`collapseOrder${order.orderId}`}
                      >
                        <table className="table table-bordered m-0 mt-3">
                          <thead className="table-light">
                            <tr>
                              <th>Product</th>
                              <th>Variant</th>
                              <th>Quantity</th>
                              <th>Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.products.map((product, index) => (
                              <tr key={index}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <img
                                      src={product.imageUrl}
                                      alt={product.productName}
                                      className="me-2 rounded"
                                      style={{
                                        width: "50px",
                                        height: "50px",
                                        objectFit: "cover",
                                      }}
                                    />
                                    {product.productName}
                                  </div>
                                </td>
                                <td>{product.variant}</td>
                                <td>{product.quantity}</td>
                                <td>
                                  {formatCurrencyVND(product.price ?? "N/A")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Phân trang */}
            {orders?.length > 0 && (
              <nav className="d-flex justify-content-between align-items-center mt-4">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                >
                  Previous
                </button>
                <span>
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages - 1}
                >
                  Next
                </button>
              </nav>
            )}
          </div>

          <div className="col-md-4">
            <h4 className="fw-bold">Address</h4>
            <div className="w-full pb-3 d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-dark d-flex align-items-center justify-content-center gap-2 p-3 rounded-pill shadow-sm"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal9"
                onClick={() => {
                  setIdEdit(-1);
                  setProvinceId("");
                  setDistrictId("");
                  setAddressDetal("");
                  setDistricts([]);
                  setWardId("");
                  setWards([]);
                }}
                style={{
                  backgroundColor: "#000", // Màu đen
                  borderColor: "#000",
                  color: "#fff", // Chữ trắng để nổi bật
                  fontSize: "16px",
                  fontWeight: "bold",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <i
                  className="zmdi zmdi-plus"
                  style={{
                    fontSize: "20px",
                  }}
                ></i>
                <span>Add Address</span>
              </button>
            </div>

            <div className="w-full">
              <ul className="list-group">
                {addresses &&
                  addresses.map((address, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center p-3 bg-white shadow-sm rounded"
                    >
                      <div>
                        <p className="mb-1 fw-bold">{address.detailAddress}</p>
                        <p className="mb-0 text-muted">
                          {`${getNameAddress(
                            address.province
                          )}, ${getNameAddress(
                            address.district
                          )}, ${getNameAddress(address.ward)}`}
                        </p>
                      </div>

                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-outline-secondary me-2 d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            padding: 0,
                          }}
                          onClick={() => {
                            setIdEdit(address.addressId);
                            setProvinceId(
                              JSON.stringify(
                                provinces.find(
                                  (p) =>
                                    p.ProvinceID ==
                                    address.province
                                      .substring(
                                        0,
                                        address.province.indexOf(" ")
                                      )
                                      .trim()
                                )
                              )
                            );
                            setAddressDetal(address.detailAddress);
                          }}
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal9"
                        >
                          <i
                            className="zmdi zmdi-edit"
                            style={{ fontSize: "1.2rem", color: "#6c757d" }}
                          ></i>
                        </button>
                        <button
                          className="btn btn-outline-danger d-flex align-items-center justify-content-center"
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            padding: 0,
                          }}
                          onClick={() => {
                            handleDeleteAddress(address.addressId);
                          }}
                        >
                          <i
                            className="zmdi zmdi-delete"
                            style={{ fontSize: "1.2rem" }}
                          ></i>
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>

              {showToast && (
                <div
                  className="toast show position-fixed bottom-0 end-0 p-3"
                  style={{ zIndex: 1050 }}
                >
                  <div className="toast-body">
                    Coupon code copied to clipboard!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* <!-- Modal ADDRESS -->   */}
        <div
          className="modal fade"
          id="exampleModal9"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content rounded-0 ">
              <div className="modal-header pb-1 pt-2">
                <h1
                  className="modal-title  stext-101 cl5 size-103 d-flex align-items-center"
                  id="exampleModalLabel"
                >
                  {idEdit === -1 ? "Add address" : "Update address"}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                <div>
                  <div className="form-group mb-3">
                    <label className="stext-110" htmlFor="addressInput">
                      Address
                    </label>
                    <div className="row">
                      <div className="col-md-4 mb-2">
                        <select
                          className={`form-select rounded-0 ${
                            errPro ? "is-invalid" : ""
                          }`}
                          aria-label="Select Country"
                          onChange={(e) =>
                            setProvinceId(e.target.value.replace(/'/g, '"'))
                          }
                        >
                          <option className="stext-110" selected value={""}>
                            Select province
                          </option>

                          {provinces &&
                            provinces.map((item) => {
                              return (
                                <option
                                  selected={
                                    item.ProvinceID ===
                                    (provinceId === ""
                                      ? -1
                                      : JSON.parse(provinceId)?.ProvinceID)
                                  }
                                  key={item.ProvinceID}
                                  className="stext-110"
                                  value={JSON.stringify(item).replace(
                                    /"/g,
                                    "'"
                                  )}
                                >
                                  {item.NameExtension[1]}
                                </option>
                              );
                            })}
                        </select>
                        {errPro && (
                          <div className="invalid-feedback">
                            Please select a province
                          </div>
                        )}
                      </div>
                      <div className="col-md-4 mb-2">
                        <select
                          className={`form-select rounded-0 ${
                            errDis ? "is-invalid" : ""
                          }`}
                          aria-label="Select City"
                          onChange={(e) =>
                            setDistrictId(e.target.value.replace(/'/g, '"'))
                          }
                        >
                          <option className="stext-110" selected value={""}>
                            Select district
                          </option>

                          {districts &&
                            districts.map((item) => {
                              return (
                                <option
                                  selected={
                                    item.DistrictID ===
                                    (districtId === ""
                                      ? -1
                                      : JSON.parse(districtId)?.DistrictID)
                                  }
                                  key={item.DistrictID}
                                  className="stext-110"
                                  value={JSON.stringify(item).replace(
                                    /"/g,
                                    "'"
                                  )}
                                >
                                  {item?.DistrictName}
                                </option>
                              );
                            })}
                        </select>
                        {errDis && (
                          <div className="invalid-feedback">
                            Please select a district
                          </div>
                        )}
                      </div>
                      <div className="col-md-4 mb-2">
                        <select
                          className={`form-select rounded-0 ${
                            errWar ? "is-invalid" : ""
                          }`}
                          aria-label="Select District"
                          onChange={(e) =>
                            setWardId(e.target.value.replace(/'/g, '"'))
                          }
                        >
                          <option className="stext-110" selected value={""}>
                            Select ward
                          </option>

                          {wards &&
                            wards?.map((item) => {
                              return (
                                <option
                                  selected={
                                    item.WardCode ===
                                    (wardId === "" || wardId === undefined
                                      ? -1
                                      : JSON.parse(wardId)?.WardCode)
                                  }
                                  key={item?.WardCode}
                                  className="stext-110"
                                  value={JSON.stringify(item).replace(
                                    /"/g,
                                    "'"
                                  )}
                                >
                                  {item?.WardName}
                                </option>
                              );
                            })}
                        </select>
                        {errWar && (
                          <div className="invalid-feedback">
                            Please select a ward
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label className="stext-110" htmlFor="detailedAddressInput">
                      Detailed Address
                    </label>
                    <input
                      type="text"
                      className={`stext-110 form-control rounded-0 ${
                        errDetail ? "is-invalid" : ""
                      }`}
                      id="detailedAddressInput"
                      placeholder="House number, street, etc."
                      value={addressDetal}
                      onChange={(e) => {
                        setAddressDetal(e.target.value);
                      }}
                    />
                    {errDetail && (
                      <div className="invalid-feedback">
                        Please enter detailed address
                      </div>
                    )}
                  </div>

                  <button
                    className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer"
                    type="submit"
                    onClick={handleSaveAddress}
                  >
                    {idEdit === -1 ? "Add address" : "Update address"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content rounded">
              {/* Modal Header */}
              <div className="modal-header border-0 bg-light">
                <h2
                  className="modal-title fw-bold text-dark"
                  id="exampleModalLabel"
                >
                  Edit Profile
                </h2>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body">
                <form className="w-100" onSubmit={handleSubmit}>
                  <div className="row">
                    {/* User Image Section */}
                    <div className="col-md-5 text-center border-end">
                      <div className="d-flex justify-content-center">
                        <img
                          src={
                            selectedImage || profile?.listData?.image || Avatar
                          }
                          alt="User Avatar"
                          className="img-thumbnail rounded-circle mb-3"
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <div className="mb-3">
                        <input
                          type="file"
                          id="fileInput"
                          className="d-none"
                          onChange={handleImageChange}
                        />
                        <label
                          htmlFor="fileInput"
                          className="btn btn-outline-primary px-4 py-2"
                          style={{ cursor: "pointer" }}
                        >
                          Choose Image
                        </label>
                      </div>
                      <div className="text-muted">
                        <p className="mb-1">
                          Provider:{" "}
                          <strong>
                            {profile?.listData?.provider === "Guest"
                              ? profile.listData.username
                              : "Social"}
                          </strong>
                        </p>
                        <p className="mb-0">
                          Create Date:{" "}
                          {profile?.listData?.createDate
                            ? format(
                                new Date(profile.listData.createDate),
                                "dd/MM/yyyy"
                              )
                            : "15/08/2023"}
                        </p>
                      </div>
                    </div>

                    {/* Editable Fields Section */}
                    <div className="col-md-7">
                      <div className="mb-3">
                        <label
                          htmlFor="full_name"
                          className="form-label fw-bold"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="full_name"
                          className="form-control"
                          placeholder="Full Name"
                          value={formData.fullName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fullName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label fw-bold">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="form-control"
                          placeholder="Email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="phone" className="form-label fw-bold">
                          Phone
                        </label>
                        <input
                          type="text"
                          id="phone"
                          className="form-control"
                          placeholder="Phone"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="gender" className="form-label fw-bold">
                          Gender
                        </label>
                        <div className="d-flex">
                          {["Male", "Female", "Other"].map((value) => (
                            <div className="form-check me-3" key={value}>
                              <input
                                className="form-check-input"
                                type="radio"
                                id={`gender-${value}`}
                                name="gender"
                                value={value}
                                checked={gender === value}
                                onChange={(e) => setGender(e.target.value)}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`gender-${value}`}
                              >
                                {value}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="birthday"
                          className="form-label fw-bold"
                        >
                          Birthday
                        </label>
                        <input
                          type="date"
                          id="birthday"
                          className="form-control"
                          value={birthday}
                          onChange={handleBirthdayChange}
                        />
                      </div>
                      <div className="text-end">
                        <button
                          type="submit"
                          className="btn btn-success px-4 py-2 rounded-pill"
                        >
                          Update Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;

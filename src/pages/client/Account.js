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
import moment from 'moment';
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

  // const formattedBirthday = birthday ? format(new Date(birthday), 'yyyy/MM/dd') : null;
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0); // Quản lý trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [loading, setLoading] = useState(true);

  // Hàm gọi API getOrder
  const fetchOrders = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const data = await productApi.getOrder(10, pageNumber); // Gọi API getOrder với page

      setOrders(data.content); // Lưu danh sách đơn hàng
      setTotalPages(data.totalPages); // Lưu tổng số trang
      setPage(data.number); // Lưu trang hiện tại
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component được render lần đầu tiên
  useEffect(() => {
    fetchOrders();
  }, []);

  // Hàm xử lý khi người dùng chuyển trang
  const handlePageChange = (newPage) => {
    fetchOrders(newPage); // Gọi API với trang mới
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

  return (
    <div
      className="container mt-5 pt-5 d-flex justify-content-center"
      style={styles.container}
    >
      <div className="w-full">
        <div className="d-flex align-items-center border-bottom border-2 mb-4">
          <div>
            <img
              src={profile?.listData?.image || Avatar}
              alt="User IMG"
              style={styles.accountImg1}
              className="account-img me-4"
            />
          </div>
          <div>
            <h3>
              {profile && profile.listData && profile.listData.fullName
                ? profile.listData.fullName
                : "Your Name"}
            </h3>
            <h5 className="mb-2 stext-110">
              {profile?.listData?.provider === "Guest"
                ? profile.listData.username
                : "Social"}
            </h5>
          </div>
          <div className="d-flex ms-auto flex-column flex-md-row">
            {/* <!-- Button trigger modal --> */}
            <button
              type="button"
              className="rounded-0 flex-c-m stext-106 cl6 size-104 bor4 pointer hov-btn3 trans-04 mb-2 mb-md-0 me-md-4"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              <i className="zmdi zmdi-edit"></i>
              Edit
            </button>

            {/* <button
              type="button"
              className="rounded-0 flex-c-m stext-106 cl6 size-104 bor4 pointer hov-btn3 trans-04"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal9"
            >
              <i className="zmdi zmdi-pin"></i>
              Address
            </button> */}
          </div>
        </div>
        <div className="row mb-5">
          <div className="col-md-8">
            <h4 className="stext-301">Orders</h4>
            <div className="overflow-y-auto" style={{ height: "60vh" }}>
              {orders?.length === 0 ? (
                <div>Không có đơn hàng nào</div>
              ) : (
                orders?.map((order) => (
                  <div key={order.orderId} className="mb-2">
                    <div className="card rounded-0 bor4 p-2">
                      <div
                        className="card-header d-flex justify-content-between align-items-center bg-white pointer"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapseOrder${order.orderId}`}
                        aria-expanded="false"
                        aria-controls={`collapseOrder${order.orderId}`}
                      >
                        <div>
                          <strong className="stext-103">
                            Order #{order.orderId}
                          </strong>{" "}
                          <br />
                          <small className=" stext-113">
                          {moment(order?.orderDate).subtract(7, 'hours').format('DD/MM/YYYY HH:mm')}
                          </small>
                        </div>
                        <span
                          className={`badge text-bg-${
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
                          }`}
                        >
                          {order.statusName}
                        </span>

                        <div>
                          <strong className="stext-103">
                            Total: {order.totalPrice.toFixed(2)} VND
                          </strong>
                        </div>
                      </div>

                      {/* Dropdown for Order Details */}
                      <div>
                        <div
                          className="collapse"
                          id={`collapseOrder${order.orderId}`}
                        >
                          <table className="table table-bordered m-0 mt-4">
                            <thead>
                              <tr>
                                <th className="stext-102">Product</th>
                                <th className="stext-102">Variant</th>
                                <th className="stext-102">Quantity</th>
                                <th className="stext-102">Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.products.map((product, index) => (
                                <tr key={index}>
                                  <td className="stext-103">
                                    <img
                                      src={product.imageUrl}
                                      alt={product.productName}
                                      style={{
                                        width: "50px",
                                        marginRight: "10px",
                                      }}
                                    />
                                    {product.productName}
                                  </td>
                                  <td className="txt-middle stext-103">
                                    {product.variant}
                                  </td>
                                  <td className="txt-middle stext-103">
                                    {product.quantity}
                                  </td>
                                  <td className="txt-middle stext-103">
                                    ${product.price.toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {orders?.length > 0 && (
              <div className="pagination my-3">
                <button
                  className="rounded-0 flex-c-m cl6 px-4 py-2 bor4 pointer hov2 trans-04 mb-2 mb-md-0 me-md-4"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                >
                  Previous
                </button>
                <span className="mx-3 pt-1 mt-2 stext-103">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  className="rounded-0 flex-c-m cl6 px-4 py-2 bor4 pointer hov2 trans-04 mb-2 mb-md-0 me-md-4"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages - 1}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          <div className="col-md-4">
            <h4 className="stext-301">Address</h4>

            <div className="w-full pb-3 d-flex justify-content-end">
              <button
                type="button"
                className="flex-c-m stext-101 cl2 size-119 bg8 bor13 hov-btn3 p-lr-15 trans-04 pointer m-tb-10 rounded-0"
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
              >
                <i className="zmdi zmdi-plus me-1"></i>
                <span>{"Add address"}</span>
              </button>
            </div>

            <div className="w-full">
              <ul className="list-unstyled">
                {addresses &&
                  addresses.map((code, index) => (
                    <li
                      key={index}
                      className="address-item rounded-0 rounded bor4 mb-3 p-3"
                    >
                      <div className="row">
                        <div className="col-10">
                          <p className="address-detail stext-110">
                            {code.detailAddress}
                          </p>
                          <p className="address-location text-muted stext-103">
                            {`${getNameAddress(
                              code.province
                            )}, ${getNameAddress(
                              code.district
                            )}, ${getNameAddress(code.ward)}`}
                          </p>
                        </div>

                        <div className="col-2 text-end">
                          <i
                            onClick={() => {
                              setIdEdit(code.addressId);
                              setProvinceId(
                                JSON.stringify(
                                  provinces.find(
                                    (p) =>
                                      p.ProvinceID ==
                                      code.province
                                        .substring(
                                          0,
                                          code.province.indexOf(" ")
                                        )
                                        .trim()
                                  )
                                )
                              );
                              setAddressDetal(code.detailAddress);
                            }}
                            className="zmdi zmdi-edit rounded-0 flex-c-m  cl6 px-4 py-2 bor4 pointer hov2 trans-04 mb-2 mb-md-0 me-md-4"
                            style={{ fontSize: "1.2rem", cursor: "pointer" }}
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal9"
                          ></i>

                          <i
                            onClick={() => {
                              handleDeleteAddress(code.addressId);
                            }}
                            className="zmdi zmdi-delete text-danger rounded-0 flex-c-m  cl6 px-4 py-2 bor4 pointer hov2 trans-04 mb-2 mb-md-0 me-md-4 mt-2"
                            style={{ fontSize: "1.2rem", cursor: "pointer" }}
                          ></i>
                        </div>
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
        {/* <!-- Modal --> */}
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xl ">
            <div className="modal-content rounded-0 ">
              <div className="modal-header pb-1 pt-2">
                <h1
                  className="modal-title  stext-101 cl5 size-103 d-flex align-items-center"
                  id="exampleModalLabel"
                >
                  Edit Profile
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form className="w-100 p-2" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-5 text-center">
                      {/* Image */}
                      <img
                        src={
                          selectedImage || profile?.listData?.image || Avatar
                        }
                        alt="User IMG"
                        style={styles.accountImg}
                        className="account-img mb-3"
                      />
                      <div className="mb-4">
                        <input
                          type="file"
                          id="fileInput"
                          className="d-none"
                          onChange={handleImageChange}
                        />
                        <label
                          htmlFor="fileInput"
                          className="btn btn-outline-primary rounded-0 stext-110"
                          style={{ cursor: "pointer" }}
                        >
                          Choose Image
                        </label>
                      </div>
                      {/* Read-only fields */}
                      <div className="mb-4">
                        <h5 className="mb-2 stext-110">
                          {profile?.listData?.provider === "Guest"
                            ? profile.listData.username
                            : "Social"}
                        </h5>
                        <p className="stext-111">
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
                    <div className="col-md-7">
                      <div className="">
                        {/* Editable fields */}
                        <div className="mb-3">
                          <label className="stext-110 mb-2" htmlFor="full_name">
                            Full Name
                          </label>
                          <div style={{ ...styles.bor8, ...styles.mB12 }}>
                            <input
                              id="full_name"
                              className="form-control rounded-0"
                              style={{
                                ...styles.stext111,
                                ...styles.size111,
                                ...styles.pLr15,
                              }}
                              type="text"
                              name="full_name"
                              placeholder="Full Name"
                              value={formData.fullName}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  fullName: e.target.value,
                                })
                              } // Cập nhật khi thay đổi
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="stext-110  mb-2" htmlFor="email">
                            Email
                          </label>
                          <div style={{ ...styles.bor8, ...styles.mB12 }}>
                            <input
                              id="email"
                              className="form-control rounded-0"
                              style={{
                                ...styles.stext111,
                                ...styles.size111,
                                ...styles.pLr15,
                              }}
                              type="email"
                              name="email"
                              placeholder="Email"
                              value={formData.email}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  email: e.target.value,
                                })
                              } // Cập nhật khi thay đổi
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="stext-110  mb-2" htmlFor="phone">
                            Phone
                          </label>
                          <div style={{ ...styles.bor8, ...styles.mB12 }}>
                            <input
                              id="phone"
                              className="form-control rounded-0"
                              style={{
                                ...styles.stext111,
                                ...styles.size111,
                                ...styles.pLr15,
                              }}
                              type="text"
                              name="phone"
                              placeholder="Phone"
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  phone: e.target.value,
                                })
                              } // Cập nhật khi thay đổi
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="stext-110" htmlFor="gender">
                            Gender
                          </label>
                          <div className="d-flex flex-row pl-2 p-2">
                            <div
                              className="form-check"
                              style={{ marginRight: "20px" }}
                            >
                              <input
                                id="gender-male"
                                className="form-check-input m-0 mt-1"
                                type="radio"
                                name="gender"
                                value="Male"
                                checked={gender === "Male"}
                                onChange={(e) => setGender(e.target.value)}
                              />
                              <label
                                htmlFor="gender-male"
                                className="form-check-label"
                              >
                                Male
                              </label>
                            </div>
                            <div
                              className="form-check me-3"
                              style={{ marginRight: "20px" }}
                            >
                              <input
                                id="gender-female"
                                className="form-check-input m-0 mt-1"
                                type="radio"
                                name="gender"
                                value="Female"
                                checked={gender === "Female"}
                                onChange={(e) => setGender(e.target.value)}
                              />
                              <label
                                htmlFor="gender-female"
                                className="form-check-label"
                              >
                                Female
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                id="gender-other"
                                className="form-check-input m-0 mt-1"
                                type="radio"
                                name="gender"
                                value="Other"
                                checked={gender === "Other"}
                                onChange={(e) => setGender(e.target.value)}
                              />
                              <label
                                htmlFor="gender-other"
                                className="form-check-label"
                              >
                                Other
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="mb-5">
                          <label className="stext-110  mb-2" htmlFor="birthday">
                            Birthday
                          </label>
                          <div style={{ ...styles.bor8, ...styles.mB12 }}>
                            <input
                              id="birthday"
                              className="form-control rounded-0"
                              style={{
                                ...styles.stext111,
                                ...styles.size111,
                                ...styles.pLr15,
                              }}
                              type="date"
                              name="birthday"
                              value={birthday}
                              onChange={handleBirthdayChange}
                            />
                          </div>
                        </div>
                        <div className="flex-w">
                          <button
                            type="submit"
                            className="flex-c-m stext-101 cl0 size-116 bg3 bor14 hov-btn3 p-lr-15 trans-04 pointer"
                          >
                            Update Profile
                          </button>
                        </div>
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

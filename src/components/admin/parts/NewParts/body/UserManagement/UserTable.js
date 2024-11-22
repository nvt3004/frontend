import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import PaginationSft from "../../../../PaginationSft";
import DataTableSft from "../../../../DataTableSft";
import ModalSft from "../../../../ModalSft";
import AvatarUpload from "../../../../AvatarUpload ";
import { Pencil, Trash, Plus, UserCirclePlus } from "phosphor-react";
import { stfExecAPI } from "../../../../../../stf/common";
import FullScreenSpinner from "../../../FullScreenSpinner";

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

const UserTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isModalQuyenOpen, setIsModalQuyenOpen] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState({});
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("0");
  const [showPass, setShowPass] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState(1);
  const [loading, setLoading] = useState(false);

  // ********** Cấu hình table*********
  const columns = [
    { title: "Email / Phone number", dataIndex: "username", key: "name" },
    { title: "Fullname", dataIndex: "fullname", key: "age" },
    { title: "Birthday", dataIndex: "birthday", key: "birthday" },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (value, record) => {
        return value === 0 ? "" : value === 1 ? "Male" : "Female";
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        if (text === 0) {
          return (
            <span class="badge bg-label-danger me-1" style={{ width: "80px" }}>
              inactive
            </span>
          );
        } else {
          return (
            <span class="badge bg-label-success me-1" style={{ width: "80px" }}>
              active
            </span>
          );
        }
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => {
        return record.status === 0 ? (
          ""
        ) : (
          <div>
            <button
              className="btn btn-dark btn-sm me-2"
              onClick={() => handleEdit(record)}
            >
              <Pencil weight="fill" />
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(record)}
            >
              <Trash weight="fill" />
            </button>
          </div>
        );
      },
    },
    {
      title: "Permissions",
      key: "permissions",
      render: (text, record) => {
        return record.status === 0 ? (
          ""
        ) : (
          <div>
            <button
              className="btn btn-dark btn-sm me-2"
              onClick={() => handleClickPermission(record)}
            >
              <UserCirclePlus size={17} weight="fill" />
            </button>
          </div>
        );
      },
      className: "center",
    },
  ];

  const btnTable = () => {
    return (
      <div className="d-flex">
        <button className="btn btn-dark me-3" onClick={handleClickAdd}>
          Add new <Plus weight="fill" />
        </button>

        <select
          className="form-select w-25"
          id="exampleFormControlSelect1"
          onChange={(e) => {
            handleChangeSelectFilterActive(e.target.value);
            setStatus(e.target.value);
          }}
        >
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
      </div>
    );
  };

  // ********** Các hành động xử lý logic*********
  //Change trạng thái lọc
  const handleChangeSelectFilterActive = async (value) => {
    const fetchUsers = async () => {
      setLoading(true);
      const [error, data] = await stfExecAPI({
        url: `api/admin/user/all?page=${1}&size=${6}&keyword=${keyword}&status=${Number(
          value
        )}`,
      });

      if (data) {
        setLoading(false);
        setUsers(data.data);
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

    fetchUsers();
  };

  //Click vào edit trên bảng
  const handleEdit = (record) => {
    setFullName(record.fullname);
    setUsername(record.username);
    setPassword("");
    setGender(record.gender);
    setBirthday(formatDate(record.birthday, "YYYY-MM-DD"));
    setIsModalOpen(true);
    setUser({ ...record });
    setShowPass(false);
  };

  //Nhấn nút delete
  const handleDelete = (record) => {
    setIsModalDeleteOpen(true);
    setUser({ ...record });
  };

  const handleClickPermission = async (record) => {
    setIsModalQuyenOpen(true);
    setUser({ ...record });

    const fetchPermissions = async () => {
      const [error, data] = await stfExecAPI({
        url: `api/admin/userpermissions/${record.userId}`,
      });

      if (data) {
        setPermissions(data.data);
        return;
      }

      setPermissions([]);
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

    fetchPermissions();
  };

  //Nhấn nút thêm mới
  const handleClickAdd = () => {
    setFullName("");
    setUsername("");
    setPassword("");
    setGender(0);
    setBirthday("");
    setIsModalOpen(true);
    setUser(null);
  };

  // Modal thêm mới
  const handleOk = async () => {
    const isAdd = Object.keys(user || {}).length === 0;

    if (!isAdd && showPass && !password.trim()) {
      toast.error(
        `Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character`,
        {
          className: "toast-message",
          position: "top-right",
          autoClose: 5000,
        }
      );
      return;
    }

    setLoading(true);

    const [error, data] = await stfExecAPI({
      method: isAdd ? "post" : "put",
      url: isAdd
        ? `api/admin/userpermissions/add`
        : "api/admin/userpermissions/update",
      data: {
        id: user?.userId || 0,
        fullName: fullName,
        username: username,
        password: isAdd ? password : showPass ? password : "",
        image: isAdd ? file : file !== null ? file : "",
        birthday: birthday,
        gender: gender,
      },
    });

    setLoading(false);
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
      return;
    }

    const fetchUsers = async () => {
      const [error, data] = await stfExecAPI({
        url: `api/admin/user/all?page=${1}&size=${6}&keyword=${""}&status=${1}`,
      });

      if (data) {
        setUsers(data.data);
      }
    };

    fetchUsers();

    toast.success(`${isAdd ? "Add" : "Update"} user success!`, {
      className: "toast-message",
      position: "top-right",
      autoClose: 5000,
    });

    setIsModalOpen(false); // Đóng modal khi nhấn "Save changes"
  };

  const handleCancel = () => {
    setIsModalOpen(false); // Đóng modal khi nhấn "Close"
  };

  //Modal xóa
  const handleModalDeleteOk = async () => {
    setLoading(true);

    const [error, data] = await stfExecAPI({
      method: "delete",
      url: `api/admin/userpermissions/delete/${user.userId}`,
    });

    setLoading(false);
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
      return;
    }

    const fetchUsers = async () => {
      const [error, data] = await stfExecAPI({
        url: `api/admin/user/all?page=${1}&size=${6}&keyword=${""}&status=${1}`,
      });

      if (data) {
        setUsers(data.data);
      }
    };

    fetchUsers();

    toast.success(`Delete user success!`, {
      className: "toast-message",
      position: "top-right",
      autoClose: 5000,
    });

    setIsModalDeleteOpen(false); // Đóng modal khi nhấn "Save changes"
  };

  const handleModalDeleteCancel = () => {
    setIsModalDeleteOpen(false); // Đóng modal khi nhấn "Close"
  };

  //Modal phân quyền
  const handleModalQuyenOk = async () => {
    const pers = permissions.flatMap((item) => item.permission);
    setLoading(true);
    const [error, data] = await stfExecAPI({
      method: "post",
      url: `api/admin/userpermissions/save-per`,
      data: {
        userId: user.userId,
        permission: pers,
      },
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

    toast.success(`Save role success!`, {
      className: "toast-message",
      position: "top-right",
      autoClose: 5000,
    });

    setLoading(false);
    setIsModalQuyenOpen(false); // Đóng modal khi nhấn "Save changes"
  };

  const handleModalQuyenCancel = () => {
    setPermissions([]);
    setIsModalQuyenOpen(false); // Đóng modal khi nhấn "Close"
  };

  // Hàm nhận file từ component con
  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile) {
      setFile(null);
      return;
    }

    try {
      const base64String = await convertToBase64(selectedFile);
      setFile(base64String.split(",")[1]); // Lưu chuỗi Base64 vào state
    } catch (error) {
      console.error("Lỗi chuyển đổi file:", error);
    }
  };

  //Phân quyền
  // Cập nhật trạng thái checkbox cho từng checkbox
  const handleCheckboxChange = (uTitle, pId, checked) => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((u) =>
        u.title === uTitle
          ? {
              ...u,
              permission: u.permission.map((p) => {
                if (p.id === pId) {
                  return { ...p, use: checked };
                }
                return p;
              }),
            }
          : u
      )
    );
  };

  const handleUpdateOrDeleteChange = (uTitle, pId, checked) => {
    setPermissions((prevPermissions) => {
      return prevPermissions.map((u) => {
        if (u.title.toLowerCase() == uTitle.toLowerCase()) {
          const updatedPermissions = u.permission.map((p) => {
            // Nếu chọn Update hoặc Delete, tự động chọn View nếu chưa chọn
            if ((p.name == "Delete" || p.name == "Update") && checked) {
              const viewPermission = u.permission.find(
                (p) => p.name === "View"
              );

              if (viewPermission && !viewPermission.checked) {
                viewPermission.use = true;
              }
            }

            if (p.id === pId) {
              return { ...p, use: checked };
            }

            return p;
          });
          return { ...u, permission: updatedPermissions };
        }

        return u;
      });
    });
  };

  const handleViewChange = (uTitle, checked) => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((u) => {
        if (u.title === uTitle) {
          const updatedPermissions = u.permission.map((p) => {
            if (p.name === "View") {
              // Nếu bỏ chọn View, kiểm tra và bỏ chọn các quyền Update/Delete nếu cần
              if (!checked) {
                const updatePermission = u.permission.find(
                  (p) => p.name === "Update"
                );
                const deletePermission = u.permission.find(
                  (p) => p.name === "Delete"
                );
                if (updatePermission) updatePermission.use = false;
                if (deletePermission) deletePermission.use = false;
              }
              return { ...p, use: checked };
            }
            return p;
          });
          return { ...u, permission: updatedPermissions };
        }
        return u;
      })
    );
  };

  const handleAllCheckboxStatus = (uTitle) => {
    const userPerm = permissions.find((u) => u.title === uTitle);
    return userPerm?.permission.every((p) => p.use) || false; // kiểm tra tất cả các checkbox đã được chọn chưa
  };

  const handleAllCheckboxChange = (uTitle, checked) => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((u) =>
        u.title === uTitle
          ? {
              ...u,
              permission: u.permission.map((p) => ({
                ...p,
                use: checked,
              })),
            }
          : u
      )
    );
  };

  //Đổ danh sách user
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const [error, data] = await stfExecAPI({
        url: `api/admin/user/all?page=${1}&size=${6}&keyword=${""}&status=${1}`,
      });

      if (data) {
        setLoading(false);
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

      setLoading(false);
    };

    fetchUsers();
  }, []);

  const onChangePagination = async (page) => {
    setLoading(true);

    const [error, data] = await stfExecAPI({
      url: `api/admin/user/all?page=${page}&size=${6}&keyword=${
        keyword || ""
      }&status=${Number(status)}`,
    });

    setLoading(false);
    if (data) {
      setUsers(data.data);
    }
  };

  const onChangeInputSearch = async (value) => {
    setKeyword(value);
    setLoading(true);
    const [error, data] = await stfExecAPI({
      url: `api/admin/user/all?page=${
        (users.number || 0) + 1
      }&size=${6}&keyword=${value}&status=${Number(status)}`,
    });

    setLoading(false);
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
  };

  return (
    <>
      <FullScreenSpinner isLoading={loading} />
      <DataTableSft
        dataSource={users?.content || []}
        columns={columns}
        title={"Staff list"}
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

      <ModalSft
        title="Infomation staff"
        titleOk={Object.keys(user || {}).length === 0 ? "Add new" : "Update"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        size="modal-lg"
      >
        <form>
          <div className="row">
            <div className="col-md-5">
              <AvatarUpload
                pathImage={user ? user.image || "" : ""}
                onFileSelect={handleFileSelect}
              />
            </div>

            <div className="col-md-7">
              <div className="row mb-4">
                <div className="col-md-12">
                  <label
                    className="form-label"
                    htmlFor="basic-default-fullname"
                  >
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="basic-default-fullname"
                    placeholder="Enter fullname"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              <div className="row mb-4">
                <label className="form-label" htmlFor="basic-default-email">
                  Email / Phone number <span className="text-danger">*</span>
                </label>
                <div className="input-group input-group-merge">
                  <input
                    type="text"
                    id="basic-default-email"
                    className="form-control"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={Object.keys(user || {}).length > 0}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-12">
                  <label
                    className="form-label d-flex"
                    htmlFor="basic-default-password"
                  >
                    {Object.keys(user || {}).length === 0
                      ? "Password"
                      : "Change password"}{" "}
                    <span className="text-danger">
                      {Object.keys(user || {}).length === 0 ? "*" : ""}
                    </span>{" "}
                    {/* Checkbox pasword */}
                    <div
                      class="form-check form-switch mb-2"
                      style={{ marginLeft: "10px" }}
                    >
                      {Object.keys(user || {}).length === 0 ? (
                        ""
                      ) : (
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="flexSwitchCheckChecked"
                          onChange={(e) => {
                            setShowPass(e.target.checked);
                          }}
                        />
                      )}
                    </div>
                  </label>

                  {Object.keys(user || {}).length === 0 ? (
                    <input
                      type="password"
                      className="form-control"
                      id="basic-default-password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  ) : showPass ? (
                    <input
                      type="password"
                      className="form-control"
                      id="basic-default-password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-5 mb-3">
              <label className="form-label" htmlFor="basic-default-birthday">
                Birthday
              </label>
              <input
                type="date"
                id="basic-default-birthday"
                className="form-control"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </div>

            <div className="col-md-7">
              <label htmlFor="exampleFormControlSelect1" className="form-label">
                Gender
              </label>
              <select
                className="form-select"
                id="exampleFormControlSelect1"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="0">Chose gender</option>
                <option value="1">Male</option>
                <option value="2">Female</option>
              </select>
            </div>
          </div>
        </form>
      </ModalSft>

      {/* Modal xóa */}
      <ModalSft
        title="Delete staff"
        titleOk={"Delete"}
        open={isModalDeleteOpen}
        onOk={handleModalDeleteOk}
        onCancel={handleModalDeleteCancel}
        size="modal-lg"
      >
        <span>Are you sure you want to delete?</span>
      </ModalSft>

      {/* Modal phân quyền */}
      <ModalSft
        title="Permission"
        titleOk={"Save"}
        open={isModalQuyenOpen}
        onOk={handleModalQuyenOk}
        onCancel={handleModalQuyenCancel}
        size="modal-lg"
      >
        {permissions &&
          permissions.map((u) => {
            return (
              <div className="row mb-3" key={u.title}>
                <div className="col-md-3">
                  <label className="me-3">{u.title}:</label>
                </div>

                <div className="col-md-9">
                  <div className="d-flex gap-4">
                    {u.permission.map((up) => (
                      <div className="form-check me-4" key={up.id}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={up.use}
                          onChange={(e) => {
                            if (up.name === "Update" || up.name === "Delete") {
                              handleUpdateOrDeleteChange(
                                u.title,
                                up.id,
                                e.target.checked
                              );
                            } else if (up.name === "View") {
                              handleViewChange(u.title, e.target.checked);
                            } else {
                              handleCheckboxChange(
                                u.title,
                                up.id,
                                e.target.checked
                              );
                            }

                            // const per = permissions.find(
                            //   (p) =>
                            //     p.title.toLowerCase() === u.title.toLowerCase()
                            // );
                            // setPermissions();
                          }}
                          id={up.id}
                        />
                        <label className="form-check-label" htmlFor={up.id}>
                          {up.name}
                        </label>
                      </div>
                    ))}

                    <div className="form-check me-4">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={handleAllCheckboxStatus(u.title)}
                        onChange={(e) =>
                          handleAllCheckboxChange(u.title, e.target.checked)
                        }
                        id={u.title + "all"}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={u.title + "all"}
                      >
                        All
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </ModalSft>
    </>
  );
};

export default UserTable;

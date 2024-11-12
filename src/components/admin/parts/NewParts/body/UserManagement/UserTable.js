import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import PaginationSft from "../../../../PaginationSft";
import DataTableSft from "../../../../DataTableSft";
import ModalSft from "../../../../ModalSft";
import AvatarUpload from "../../../../AvatarUpload ";
import { Pencil, Trash, Plus, PenNib } from "phosphor-react";
import { stfExecAPI } from "../../../../../../stf/common";
import { render } from "@testing-library/react";

const dataSource = [
  {
    key: "1",
    name: "Mike",
    age: 32,
    address: "10 Downing Street",
    email: "mike@example.com",
    phone: "123-456-7890",
    company: "ABC Corp",
  },
  {
    key: "2",
    name: "John",
    age: 42,
    address: "20 Downing Street",
    email: "john@example.com",
    phone: "234-567-8901",
    company: "XYZ Ltd",
  },
  {
    key: "3",
    name: "Sara",
    age: 29,
    address: "30 Oak Street",
    email: "sara@example.com",
    phone: "345-678-9012",
    company: "Tech Solutions",
  },
  {
    key: "4",
    name: "David",
    age: 35,
    address: "40 Elm Street",
    email: "david@example.com",
    phone: "456-789-0123",
    company: "Innovate LLC",
  },
  {
    key: "5",
    name: "Emma",
    age: 28,
    address: "50 Maple Avenue",
    email: "emma@example.com",
    phone: "567-890-1234",
    company: "GreenTech Inc.",
  },
  {
    key: "6",
    name: "Chris",
    age: 38,
    address: "60 Pine Street",
    email: "chris@example.com",
    phone: "678-901-2345",
    company: "Design Studio",
  },
];

const userPermistions = [
  {
    title: "Manage user",
    permission: [
      { id: 2, name: "View" },
      { id: 1, name: "Add" },
      { id: 3, name: "Update" },
      { id: 4, name: "Delete" },
    ],
  },
  {
    title: "Manage product",
    permission: [
      { id: 5, name: "View" },
      { id: 6, name: "Add" },
      { id: 10, name: "Update" },
      { id: 11, name: "Delete" },
    ],
  },
  {
    title: "Manage feeddback",
    permission: [
      { id: 7, name: "View" },
      { id: 8, name: "Add" },
      { id: 9, name: "Delete" },
    ],
  },
];

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const UserTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [permissions, setPermissions] = useState(userPermistions);
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState({});
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("0");

  // ********** Cấu hình table*********
  const columns = [
    { title: "Username", dataIndex: "username", key: "name" },
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
      render: (text, record) => (
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
      ),
    },
    {
      title: "Permissions",
      key: "permissions",
      render: (text, record) => (
        <div>
          <button
            className="btn btn-dark btn-sm me-2"
            onClick={() => handleDelete(record)}
          >
            <PenNib weight="fill" />
          </button>
        </div>
      ),
      className: "center",
    },
  ];

  const btnTable = () => {
    return (
      <>
        <button className="btn btn-dark me-2" onClick={() => handleClickAdd()}>
          Add new <Plus weight="fill" />
        </button>
      </>
    );
  };

  // ********** Các hành động xử lý logic*********
  const handleEdit = (record) => {
    setFullName(record.fullname);
    setUsername(record.username);
    setPassword('');
    setGender(record.gender);
    setBirthday(record.birthday)
    setIsModalOpen(true);
    setUser({ ...record });
  };

  const handleDelete = (record) => {
    setIsModalDeleteOpen(true);
    setUser({ ...record });
  };

  const handleClickAdd = () => {
    setFullName('');
    setUsername('');
    setPassword('');
    setGender(0);
    setBirthday('');
    setIsModalOpen(true);
    setUser(null);
  };

  // Modal thêm mới
  const handleOk = async () => {
    const [error, data] = await stfExecAPI({
      method: "post",
      url: `api/admin/userpermissions/add`,
      data: {
        fullName: fullName,
        username: username,
        password: password,
        image: file,
        birthday: birthday,
        gender: gender,
      },
    });

    if (error) {
      toast.error(`${error?.response?.data?.message}`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    const fetchUsers = async () => {
      const [error, data] = await stfExecAPI({
        url: `api/admin/user/all?page=${1}&size=${6}&keyword=${""}`,
      });

      if (data) {
        setUsers(data.data);
      }
    };

    fetchUsers();

    toast.success(`Add user success!`, {
      className: "toast-message",
      position: "top-right",
      autoClose: 5000,
    });

    setIsModalOpen(false); // Đóng modal khi nhấn "Save changes"
  };

  const handleCancel = () => {
    console.log("Modal closed");
    setIsModalOpen(false); // Đóng modal khi nhấn "Close"
  };

  //Modal xóa
  const handleModalDeleteOk = () => {
    console.log("Changes saved!");
    setIsModalDeleteOpen(false); // Đóng modal khi nhấn "Save changes"
  };

  const handleModalDeleteCancel = () => {
    console.log("Modal closed");
    setIsModalDeleteOpen(false); // Đóng modal khi nhấn "Close"
  };

  // Hàm nhận file từ component con
  const handleFileSelect = async (selectedFile) => {
    try {
      const base64String = await convertToBase64(selectedFile);
      setFile(base64String.split(",")[1]); // Lưu chuỗi Base64 vào state
    } catch (error) {
      console.error("Lỗi chuyển đổi file:", error);
    }
  };

  const handleSubmit = () => {
    if (file) {
      console.log("File đã chọn:", file);
      console.log("Tên file:", file.name);
      console.log("Loại file:", file.type);
      console.log("Kích thước file (bytes):", file.size);
    } else {
      alert("Chưa có file nào được chọn.");
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
                  return { ...p, checked };
                }
                return p;
              }),
            }
          : u
      )
    );
  };

  const handleUpdateOrDeleteChange = (uTitle, pId, checked) => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((u) => {
        if (u.title === uTitle) {
          console.log("Vô");
          const updatedPermissions = u.permission.map((p) => {
            console.log("@id", pId, p);
            // Nếu chọn Update hoặc Delete, tự động chọn View nếu chưa chọn
            if ((p.name === "Delete" || p.name === "Update") && checked) {
              const viewPermission = u.permission.find(
                (p) => p.name === "View"
              );
              if (viewPermission && !viewPermission.checked) {
                viewPermission.checked = true;
              }
            }

            if (p.id === pId) {
              return { ...p, checked };
            }

            return p;
          });
          return { ...u, permission: updatedPermissions };
        }
        return u;
      })
    );
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
                if (updatePermission) updatePermission.checked = false;
                if (deletePermission) deletePermission.checked = false;
              }
              return { ...p, checked };
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
    return userPerm?.permission.every((p) => p.checked) || false; // kiểm tra tất cả các checkbox đã được chọn chưa
  };

  const handleAllCheckboxChange = (uTitle, checked) => {
    setPermissions((prevPermissions) =>
      prevPermissions.map((u) =>
        u.title === uTitle
          ? {
              ...u,
              permission: u.permission.map((p) => ({
                ...p,
                checked,
              })),
            }
          : u
      )
    );
  };

  //Đổ danh sách user
  useEffect(() => {
    const fetchUsers = async () => {
      const [error, data] = await stfExecAPI({
        url: `api/admin/user/all?page=${1}&size=${6}&keyword=${""}`,
      });

      if (data) {
        setUsers(data.data);
      }
    };

    fetchUsers();
  }, []);

  const onChangePagination = async (page, keyword = "") => {
    const [error, data] = await stfExecAPI({
      url: `api/admin/user/all?page=${page}&size=${6}&keyword=${keyword}`,
    });

    if (data) {
      setUsers(data.data);
    }
  };

  const onChangeInputSearch = async (value) => {
    const [error, data] = await stfExecAPI({
      url: `api/admin/user/all?page=${
        (users.number || 0) + 1
      }&size=${6}&keyword=${value}`,
    });

    if (data) {
      setUsers(data.data);
    } else {
      setUser({});
    }
  };

  return (
    <>
      <DataTableSft
        dataSource={users?.content || []}
        columns={columns}
        title={"Staff list"}
        isSearch={true}
        onChangeSearch={onChangeInputSearch}
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
        titleOk={"Add new"}
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
                  Username <span className="text-danger">*</span>
                </label>
                <div className="input-group input-group-merge">
                  <input
                    type="text"
                    id="basic-default-email"
                    className="form-control"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-12">
                  <label
                    className="form-label"
                    htmlFor="basic-default-password"
                  >
                    Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="basic-default-password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
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
                <option value="-1">Chose gender</option>
                <option value="0">Male</option>
                <option value="1">Female</option>
              </select>
            </div>
          </div>
        </form>
      </ModalSft>

      {/* Modal xóa */}
      {/* <ModalSft
        title="Delete staff"
        titleOk={"Delete"}
        open={isModalDeleteOpen}
        onOk={handleModalDeleteOk}
        onCancel={handleModalDeleteCancel}
        size="modal-lg"
      >
        <span>Are you sure you want to delete?</span>
      </ModalSft> */}

      {/* Modal phân quyền */}
      <ModalSft
        title="Delete staff"
        titleOk={"Delete"}
        open={isModalDeleteOpen}
        onOk={handleModalDeleteOk}
        onCancel={handleModalDeleteCancel}
        size="modal-lg"
      >
        {permissions.map((u) => {
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
                        checked={up.checked || false}
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

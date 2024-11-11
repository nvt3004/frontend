import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PaginationSft from "../../../../PaginationSft";
import DataTableSft from "../../../../DataTableSft";
import ModalSft from "../../../../ModalSft";
import { Pencil, Trash, Plus } from "phosphor-react";

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

const UserTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ********** Cấu hình table*********
  const columns = [
    { title: "Username", dataIndex: "name", key: "name" },
    { title: "Fullname", dataIndex: "age", key: "age" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Status",
      dataIndex: "age",
      key: "phone",
      render: (text, record) => {
        if (record.key == 2 || record.key == 5) {
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
            onClick={() => handleEdit(record.key)}
          >
            <Pencil weight="fill" />
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(record.key)}
          >
            <Trash weight="fill" />
          </button>
        </div>
      ),
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
  const handleEdit = (key) => {
    alert("Edit item with key: " + key);
  };

  const handleDelete = (key) => {
    alert("Deleted item with key: " + key);
  };

  const handleClickAdd = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    console.log("Changes saved!");
    setIsModalOpen(false); // Đóng modal khi nhấn "Save changes"
  };

  const handleCancel = () => {
    console.log("Modal closed");
    setIsModalOpen(false); // Đóng modal khi nhấn "Close"
  };

  return (
    <>
      <DataTableSft
        dataSource={dataSource}
        columns={columns}
        title={"User list"}
        isSearch={true}
        buttonTable={btnTable()}
      />

      <div className="d-flex justify-content-end align-items-center mt-3">
        <p className="me-3">Total 247 item</p>
        <PaginationSft count={100} defaultPage={50} siblingCount={1} />
      </div>

      <ModalSft
        title="Infomation user"
        titleOk={"Add new"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <form>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="basic-default-fullname">
                Full Name
              </label>
              <input
                type="text"
                className="form-control"
                id="basic-default-fullname"
                placeholder="Enter fullname"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="basic-default-company">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="basic-default-company"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="basic-default-email">
                Email
              </label>
              <div className="input-group input-group-merge">
                <input
                  type="text"
                  id="basic-default-email"
                  className="form-control"
                  placeholder="Enter email"
                  aria-label="john.doe"
                  aria-describedby="basic-default-email2"
                />
                <span className="input-group-text" id="basic-default-email2">
                  @example.com
                </span>
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="basic-default-phone">
                Birthday
              </label>
              <input
                type="date"
                id="basic-default-phone"
                className="form-control"
              />
            </div>
          </div>
        </form>
      </ModalSft>
    </>
  );
};

export default UserTable;

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PaginationSft from "../../../../PaginationSft";
import DataTableSft from "../../../../DataTableSft";
import ModalSft from "../../../../ModalSft";
import {
  Pencil,
  Trash,
  Plus,
  UserCirclePlus,
  CalendarBlank,
} from "phosphor-react";
import { stfExecAPI } from "../../../../../../stf/common";
import FullScreenSpinner from "../../../FullScreenSpinner";

const SuppliersTable = () => {
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState({});
  const [supplier, setSupplier] = useState({});
  const [keyword, setKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  //Thuộc tính supplier
  const [contactName, setContactName] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const fetchSuppliers = async () => {
      const [error, data] = await stfExecAPI({
        url: `api/staff/suppliers?size=${8}&page=${0}&status=true&keyword=`,
      });

      if (data) {
        setSuppliers(data.data);
      }
    };

    fetchSuppliers();
  }, []);

  const onChangeInputSearch = async (value) => {
    setKeyword(value);
    setLoading(true);
    const [error, data] = await stfExecAPI({
      url: `api/staff/suppliers?page=${
        suppliers.number || 0
      }&size=${6}&keyword=${value}&status=${true}`,
    });

    setLoading(false);
    if (data) {
      setSuppliers(data.data);
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
      setSuppliers({});
    }
  };

  const onChangePagination = async (page) => {
    setLoading(true);

    const [error, data] = await stfExecAPI({
      url: `api/staff/suppliers?size=${8}&page=${
        page === 0 ? 0 : page - 1
      }&status=true&keyword=${keyword || ""}`,
    });

    setLoading(false);
    if (data) {
      setSuppliers(data.data);
    }
  };

  //*************** Các hàm xử lý logic********************
  const handleEdit = (record) => {
    setSupplier({ ...record });
    setContactName(record.contactName);
    setSupplierName(record.supplierName);
    setEmail(record.email);
    setPhone(record.phone);
    setAddress(record.address);

    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    setSupplier({ ...record });
    setIsModalDeleteOpen(true);
  };

  const handleModalDeleteOk = async () => {
    const [error, data] = await stfExecAPI({
      method: "delete",
      url: `api/staff/suppliers?id=${supplier?.supplierId}`,
    });

    setLoading(false);
    if (error) {
      const err =
        error.status === 403
          ? "Bạn không có quyền để thực thi công việc này !"
          : error?.response?.data?.message;

      toast.error(`${err}`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    const fetchSuppliers = async () => {
      const [error, data] = await stfExecAPI({
        url: `api/staff/suppliers?size=${8}&page=${0}&status=true&keyword=`,
      });

      if (data) {
        setSuppliers(data.data);
      }
    };

    fetchSuppliers();

    toast.success(`Thành công`, {
      className: "toast-message",
      position: "top-right",
      autoClose: 5000,
    });

    setIsModalDeleteOpen(false);
  };

  const handleModalDeleteCancel = async () => {
    setSupplier({});
    setIsModalDeleteOpen(false);
  };

  const handleOk = async () => {
    const isAdd = Object.keys(supplier).length === 0;

    if (
      !contactName.trim() ||
      !supplierName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !address.trim()
    ) {
      toast.error(`Không được để trống các trường đánh dấu *`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    setLoading(true);

    const [error, data] = await stfExecAPI({
      method: isAdd ? "post" : "put",
      url: isAdd
        ? `api/staff/suppliers`
        : `api/staff/suppliers?id=${supplier?.supplierId}`,
      data: {
        contactName,
        supplierName,
        email,
        phone,
        address,
      },
    });

    setLoading(false);
    if (error) {
      const err =
        error.status === 403
          ? "Bạn không có quyền để thực thi công việc này !"
          : error?.response?.data?.message;

      toast.error(`${err}`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    const fetchSuppliers = async () => {
      const [error, data] = await stfExecAPI({
        url: `api/staff/suppliers?size=${8}&page=${0}&status=true&keyword=`,
      });

      if (data) {
        setSuppliers(data.data);
      }
    };

    fetchSuppliers();

    toast.success(`Thành công`, {
      className: "toast-message",
      position: "top-right",
      autoClose: 5000,
    });

    setIsModalOpen(false); // Đóng modal khi nhấn "Save changes"
  };

  const handleCancel = () => {
    setSupplier({});
    setContactName("");
    setSupplierName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setIsModalOpen(false);
  };

  // ********** Cấu hình table*********
  const columns = [
    { title: "Người liên hệ", dataIndex: "contactName", key: "contactName" },
    { title: "Nhà cung cấp", dataIndex: "supplierName", key: "supplierName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Điạ chỉ", dataIndex: "address", key: "address" },
    {
      title: "Hành Động",
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
  ];

  const btnTable = () => {
    return (
      <div className="d-flex">
        <button
          className="btn btn-dark me-3"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          Thêm mới <Plus weight="fill" />
        </button>

        {/* <select
          className="form-select w-25"
          id="exampleFormControlSelect1"
          onChange={(e) => {
            handleChangeSelectFilterActive(e.target.value);
            setStatus(e.target.value);
          }}
        >
          <option value="1">Hoạt động</option>
          <option value="0">Không hoạt động</option>
        </select> */}
      </div>
    );
  };

  return (
    <>
      <FullScreenSpinner isLoading={loading} />

      <DataTableSft
        dataSource={suppliers?.content || []}
        columns={columns}
        title={"Danh sách nhà cung cấp"}
        isSearch={true}
        onChangeSearch={onChangeInputSearch}
        keyword={keyword}
        buttonTable={btnTable()}
      />

      <div className="d-flex justify-content-end align-items-center mt-3">
        {/* <p className="me-3">Total 247 item</p> */}
        {suppliers.totalPages > 1 && (
          <PaginationSft
            count={suppliers.totalPages}
            defaultPage={(suppliers.number || 0) + 1}
            siblingCount={1}
            onPageChange={onChangePagination}
          />
        )}
      </div>

      <ModalSft
        title="Thông tin nhà cung cấp"
        titleOk={
          Object.keys(supplier || {}).length === 0 ? "Thêm mới" : "Cập nhật"
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        size="modal-lg"
      >
        <form>
          <div className="row mb-3">
            <div className="col-md-6 col-12">
              <label className="mb-2" htmlFor="basic-default-fullname">
                Tên người liên hệ <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="basic-default-fullname"
                placeholder="Nhập tên người liên hệ"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </div>

            <div className="col-md-6 col-12">
              <label className="mb-2" htmlFor="basic-default-fullname">
                Tên nhà cung cấp <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="basic-default-fullname"
                placeholder="Nhập tên nhà cung cấp"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6 col-12">
              <label className="mb-2" htmlFor="basic-default-fullname">
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="basic-default-fullname"
                placeholder="Nhập email nhà cung cấp"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="col-md-6 col-12">
              <label className="mb-2" htmlFor="basic-default-fullname">
                Điện thoại <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="basic-default-fullname"
                placeholder="Nhập số điện thoại nhà cung cấp"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <label for="" className="mb-2">
                Địa chỉ <span className="text-danger">*</span>
              </label>
              <textarea
                class="form-control"
                id="exampleFormControlTextarea1"
                rows="3"
                value={address}
                onInput={(e) => setAddress(e.target.value)}
                placeholder="Nhập địa chỉ nhà cung cấp"
              ></textarea>
            </div>
          </div>
        </form>
      </ModalSft>

      {/* Modal xóa */}
      <ModalSft
        title="Xóa nhà cung cấp"
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
};

export default SuppliersTable;

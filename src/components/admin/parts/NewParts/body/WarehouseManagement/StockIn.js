import React, { useEffect, useRef, useState, version } from "react";
import StockProductSearch from "./StockProductSearch";
import { Trash } from "phosphor-react";
import DataTableSft from "../../../../DataTableSft";
import { toast } from "react-toastify";
import { stfExecAPI } from "../../../../../../stf/common";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import moment from "moment";
import { getProfile } from "../../../../../../services/api/OAuthApi";
import FullScreenSpinner from "../../../FullScreenSpinner";
import { Package } from "phosphor-react";
const animatedComponents = makeAnimated();

function formatCurrencyVND(amount) {
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

const currentDate = moment().format("DD/MM/YYYY");

const StockIn = () => {
  const [products, setProducts] = useState({});
  const [versions, setVersions] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplier, setSupplier] = useState();
  const [totalPriceAndQuantity, setTotalPriceAndQuantity] = useState([0, 0]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);

  //Đổ danh sách sản phẩm
  useEffect(() => {
    const fetchUsers = async () => {
      // setLoading(true);
      const [error, data] = await stfExecAPI({
        url: `api/staff/product?page=1&size=4`,
      });

      if (data) {
        // setLoading(false);
        setProducts(data.data);
        return;
      }

      // setLoading(false);
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

  //Đổ danh sách nhà cung cấp
  useEffect(() => {
    const fetchUsers = async () => {
      // setLoading(true);
      const [error, data] = await stfExecAPI({
        url: `api/staff/suppliers/all`,
      });

      if (data) {
        // setLoading(false);
        setSuppliers(data.data);
        return;
      }

      // setLoading(false);
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

  //Tính tổng tiền và số lượng sản phẩm
  useEffect(() => {
    let totalPrice = 0;
    let totalQuantity = 0;

    versions.forEach((i) => {
      totalPrice += Number(i.total);
      totalQuantity += Number(i.quantity);
    });

    setTotalPriceAndQuantity([totalPrice, totalQuantity]);
  }, [versions]);

  //Lay profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { listData } = await getProfile();
        setProfile(listData);
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    };

    fetchProfile();
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
      dataIndex: "versionName",
      key: "versionName",
    },
    {
      title: "Giá nhập",
      dataIndex: "importPrice",
      key: "importPrice",
      render: (value, record) => {
        return (
          <input
            type="text"
            className="form-control w-100"
            id="basic-default-fullname"
            placeholder="Nhập giá"
            value={value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            onChange={(e) => {
              const inputValue = e.target.value;

              // Chỉ giữ lại các ký tự là số
              const numericValue = inputValue.replace(/\D/g, "");
              const newPrice = Number(numericValue);

              const vss = versions.map((d) => {
                if (d.id === record.id) {
                  return {
                    ...d,
                    importPrice: newPrice,
                    total: d.quantity * newPrice,
                  };
                }

                return d;
              });

              setVersions(vss);
            }}
          />
        );
      },
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (value, record) => {
        return (
          <input
            type="number"
            className="form-control w-50"
            id="basic-default-fullname"
            placeholder="Nhập số lượng"
            value={value}
            onInput={(e) => {
              const inputValue = e.target.value;
              // Cho phép giá trị rỗng (xóa sạch để nhập lại), chỉ xử lý khi có nội dung
              if (
                inputValue !== "" &&
                (!/^\d+$/.test(inputValue) || Number(inputValue) <= 0)
              ) {
                e.target.value = inputValue.replace(/[^1-9][^0-9]*/g, "");
              }
            }}
            onBlur={(e) => {
              if (e.target.value === "" || Number(e.target.value) <= 0) {
                // Nếu người dùng để trống hoặc nhập giá trị không hợp lệ khi mất tiêu điểm
                const vss = versions.map((d) => {
                  if (d.id === record.id) {
                    return {
                      ...d,
                      quantity: 1,
                      total: d.importPrice,
                    };
                  }
                  return d;
                });

                setVersions(vss);
              }
            }}
            onChange={(e) => {
              const vss = versions.map((d) => {
                if (d.id === record.id) {
                  return {
                    ...d,
                    quantity: e.target.value,
                    total: e.target.value * d.importPrice,
                  };
                }
                return d;
              });

              setVersions(vss);
            }}
          />
        );
      },
    },
    {
      title: "Tổng Tiền",
      dataIndex: "total",
      key: "total",
      render: (value, record) => {
        return formatCurrencyVND(value);
      },
    },
    {
      title: "Hành Động",
      key: "actions",
      render: (text, record) => {
        return (
          <div>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => {
                setVersions(versions.filter((i) => i.id !== record.id));
              }}
            >
              <Trash weight="fill" />
            </button>
          </div>
        );
      },
    },
  ];

  const handleNextPage = async () => {
    const page = products.number + 2;
    const [error, data] = await stfExecAPI({
      url: `api/staff/product?page=${page}&size=4`,
    });

    if (data) {
      setProducts(data.data);
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

  const handlePrevPage = async () => {
    const page = products.number + 1;

    const [error, data] = await stfExecAPI({
      url: `api/staff/product?page=${page - 1 <= 0 ? 1 : page - 1}&size=4`,
    });

    if (data) {
      setProducts(data.data);
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

  const handleSearch = async (keyword) => {
    const [error, data] = await stfExecAPI({
      url: `api/staff/product?page=${1}&size=4&keyword=${keyword}`,
    });

    if (data) {
      setProducts(data.data);
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

  const handleClickProduct = (product) => {
    setVersions([
      ...versions,
      ...product.versions
        .map((i) => {
          return {
            ...i,
            importPrice: "",
            quantity: 1,
            image: i.image.name,
            total: 0,
          };
        })
        .filter((i) => {
          return !versions.find((v) => v.id === i.id);
        }),
    ]);
  };

  // Hàm xử lý sự kiện khi chọn supplier
  const handleChange = (selectedOption) => {
    setSelectedSupplier(selectedOption);

    const fetchUsers = async () => {
      // setLoading(true);
      const [error, data] = await stfExecAPI({
        url: `api/staff/suppliers/supplier-detail?id=${selectedOption.value}`,
      });

      if (data) {
        // setLoading(false);
        setSupplier(data.data);
        return;
      }

      // setLoading(false);
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

  const handleClickAdd = async () => {
    if (!supplier) {
      toast.info("Vui lòng chọn nhà cung cấp!");
      return;
    }

    if (versions.length === 0) {
      toast.info("Vui lòng chọn ít nhất một sản phẩm!");
      return;
    }

    const versionPost = versions.map((i) => {
      return {
        productVersionId: i.id,
        quantity: i.quantity,
        price: i.importPrice,
      };
    });

    const dat = {
      supplierId: selectedSupplier.value,
      productVersions: versionPost,
      description: "Nhập kho tốt",
    };

    const [error, data] = await stfExecAPI({
      method: "post",
      url: `api/staff/receipt`,
      data: dat,
    });

    if (data) {
      setLoading(false);
      toast.success("Thành công");
      setVersions([]);
      return;
    }

    setLoading(false);
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

  return (
    <>
      <FullScreenSpinner isLoading={loading} />
      <div className="d-flex justify-content-end mb-3">
        <button
          type="button"
          className="btn btn-dark me-3"
          onClick={handleClickAdd}
        >
          {<Package />} Nhập kho
        </button>
      </div>

      <div className="row mb-3 d-flex">
        <div className="col-7 d-flex">
          <div className="card p-4 w-100">
            <label htmlFor="exampleFormControlSelect1" className="form-label">
              Nhà cung cấp
            </label>

            <Select
              closeMenuOnSelect={true}
              components={animatedComponents}
              options={suppliers.map((supplier) => ({
                value: supplier.supplierId,
                label: supplier.supplierName,
              }))} // Truyền options vào select
              onChange={handleChange} // Khi chọn, gọi hàm này
              value={selectedSupplier} // Giá trị được chọn
            />
            {selectedSupplier && (
              <div className="mt-3">
                <div className="row mb-3">
                  <div className="col-6">
                    <label>
                      <strong>Tên nhà cung cấp:</strong>{" "}
                      <span>{supplier?.supplierName}</span>
                    </label>
                  </div>
                  <div className="col-6">
                    <label>
                      <strong>Email:</strong> <span>{supplier?.email}</span>
                    </label>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">
                    <label>
                      <strong>Số điện thoại:</strong>{" "}
                      <span>{supplier?.phone}</span>
                    </label>
                  </div>
                  <div className="col-6">
                    <label>
                      <strong> Địa chỉ:</strong>{" "}
                      <span>{supplier?.address}</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-5 d-flex">
          <div className="card p-4 w-100">
            <div className="row mb-3">
              <label>
                <strong>Người nhập: </strong>
                <span> {profile?.fullName}</span>
              </label>
            </div>

            <div className="row mb-3">
              <label>
                <strong>Ngày nhập: </strong>
                <span>{currentDate}</span>
              </label>
            </div>

            <div className="row mb-3">
              <label>
                <strong>Tổng số lượng sản phẩm: </strong>
                <span>{totalPriceAndQuantity[1]}</span>
              </label>
            </div>

            <div className="row mb-3">
              <label>
                <strong>Tổng tiền phải trả: </strong>
                <span className="text-danger">
                  {formatCurrencyVND(totalPriceAndQuantity[0])}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div
          className="col-12"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          <DataTableSft columns={columns} dataSource={versions} />
        </div>
      </div>

      <StockProductSearch
        products={products.content || []}
        isPrev={products.number === 0}
        isNext={products.number === products.totalPages - 1}
        handleNext={handleNextPage}
        handlePrev={handlePrevPage}
        handleSearchs={handleSearch}
        handleClickItem={handleClickProduct}
      />
    </>
  );
};

export default StockIn;

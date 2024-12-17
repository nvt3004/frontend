import React, { useEffect, useRef, useState } from "react";
import AvatarUpload from "../../../../AvatarUpload ";
import { stfExecAPI } from "../../../../../../stf/common";
import { toast } from "react-toastify";
import FullScreenSpinner from "../../../FullScreenSpinner";
import DataTableSft from "../../../../DataTableSft";
import ModalSft from "../../../../ModalSft";
import { TagsInput } from "react-tag-input-component";
import {
  FloppyDiskBack,
  Trash,
  Plus,
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
  const [search, setSearch] = useState("");
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
      const [error, data] = await stfExecAPI({
        url: `api/staff/product/all`,
      });

      if (data) {
        setProducts(data.data);
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
      title: "Giá sau khi giảm",
      dataIndex: "total",
      key: "total",
      render: (value, row) => {
        const total = row.price * (1 - Number(percent || 0) / 100);
        return <span className="text-danger">{formatCurrencyVND(total)}</span>;
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
              onClick={() => {
                setVersions(
                  versions.filter((i) => {
                    return i.id !== record.id;
                  })
                );
              }}
            >
              <Trash weight="fill" />
            </button>
          </div>
        );
      },
    },
  ];

  //Các hàm xử lý logic
  const handleOk = () => {
    const versionsTemp = [];

    products.forEach((pd) => {
      pd?.versions?.forEach((vs) => {
        if (vs.check && !vs.sale) {
          versionsTemp.push({
            id: vs.id,
            name: vs.versionName,
            image: vs?.image?.name,
            quantity: vs?.quantity,
            price: vs?.retailPrice,
          });
        }
      });
    });

    if (versionsTemp.length === 0) {
      toast.info(`Bạn phải chọn sản phẩm để áp dụng`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });

      return;
    }

    setVersions(versionsTemp);
    setIsModalOpen(false);
  };

  const handleCancel = async () => {
    setProducts(
      products.map((pd) => {
        return {
          ...pd,
          check: false,
          versions: pd.versions.map((vs) => {
            return {
              ...vs,
              check: false,
            };
          }),
        };
      })
    );

    setIsModalOpen(false);
  };

  const handleSaveSale = async () => {
    if (!saleName.trim()) {
      toast.error(`Tên chương trình không được để trống`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });

      return;
    }

    if (!percent) {
      toast.error(`Phần trăm giảm giá không được để trống`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });

      return;
    }

    if (startDate < new Date()) {
      toast.error(`Thời gian bắt đầu phải từ hiện tại trở đi`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });

      return;
    }

    if (startDate >= endDate) {
      toast.error(`Thời gian kết thúc phải lớn hơn thời gian bắt đầu`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });

      return;
    }

    if (versions.length === 0) {
      toast.error(
        `Vui lòng chọn sản phẩm để áp dụng cho chương trình giảm giá`,
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
      method: "post",
      url: `api/admin/sale/add`,
      data: {
        saleName: saleName,
        percent: Number(percent),
        startDate: moment(startDate).format("YYYY-MM-DDTHH:mm:ss"),
        endDate: moment(endDate).format("YYYY-MM-DDTHH:mm:ss"),
        versionIds: versions.map((v) => v.id),
      },
    });

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
      setLoading(false);
      return;
    }

    setLoading(false);
    setSaleName("");
    setPercent("");
    setStartDate(new Date());
    setEndDate(new Date());
    setVersions([]);
    setProducts(
      products.map((pd) => {
        return {
          ...pd,
          check: false,
          versions: pd.versions.map((vs) => {
            return {
              ...vs,
              check: false,
            };
          }),
        };
      })
    );

    toast.success(`Thành công`, {
      className: "toast-message",
      position: "top-right",
      autoClose: 5000,
    });
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
              if (versions.length > 0) {
                const vsIds = versions.map((i) => i.id);

                setProducts(
                  products.map((pd) => {
                    const vsTemp = pd.versions.map((vs) => {
                      return {
                        ...vs,
                        check: vsIds.find((id) => id === vs.id),
                      };
                    });

                    return {
                      ...pd,
                      versions: vsTemp,
                      check: vsTemp.every((v) => v.check),
                    };
                  })
                );
              }
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

        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-dark me-3"
            onClick={handleSaveSale}
          >
            <FloppyDiskBack /> Lưu
          </button>
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
          <div className="input-group input-group-merge mb-3">
            <span className="input-group-text" id="basic-addon-search31">
              <MagnifyingGlass />
            </span>
            <input
              onChange={(e) => {
                setSearch(e.target.value?.toLowerCase());
              }} // Sử dụng hàm handleSearch thay vì onChangeSearch trực tiếp
              value={search} // Hiển thị giá trị keyword trong input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm tên sản phẩm"
              aria-label="Tìm kiếm sản phẩm"
              aria-describedby="basic-addon-search31"
            />
          </div>

          <div className="d-flex mb-3 mt-3">
            <label htmlFor="all" className="me-2">
              Chọn tất cả:{" "}
            </label>
            <input
              id="all"
              style={{ cursor: "pointer" }}
              className="form-check-input"
              type="checkbox"
              checked={products.length > 0 && products.every((pd) => pd.check)}
              onChange={(e) => {
                const newCheckState = e.target.checked;

                setProducts(
                  products.map((pd) => {
                    return {
                      ...pd,
                      check: newCheckState,
                      versions: pd.versions.map((v) => {
                        return { ...v, check: newCheckState };
                      }),
                    };
                  })
                );
              }}
            />
          </div>

          <div
            style={{
              maxHeight: "400px",
              minHeight: "400px",
              overflowY: "auto",
            }}
          >
            <table className="table table-hover">
              <tbody>
                {products
                  .filter((p) => {
                    return p.productName.toLowerCase().includes(search);
                  })
                  .map((pd) => {
                    const allVersionsChecked =
                      pd.versions.length > 0 &&
                      pd.versions.every((vs) => vs.check);
                    const isDisibleProduct = pd.versions.every((vs) => vs.sale);

                    return (
                      <React.Fragment key={pd.id}>
                        <tr
                          className="row"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            const newCheckState = !pd.check;

                            if(isDisibleProduct){
                              return;
                            }
                            setProducts(
                              products.map((i) =>
                                i.id === pd.id
                                  ? {
                                      ...i,
                                      check: newCheckState,
                                      versions: i.versions.map((vs) => ({
                                        ...vs,
                                        check: newCheckState,
                                      })),
                                    }
                                  : i
                              )
                            );
                          }}
                        >
                          <td className="col-1">
                           {isDisibleProduct?'': <input
                              style={{ cursor: "pointer" }}
                              className="form-check-input"
                              type="checkbox"
                              checked={allVersionsChecked || false}
                              onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện onClick của <tr>
                              onChange={(e) => {
                                const newCheckState = e.target.checked;
          
                                setProducts(
                                  products.map((i) =>
                                    i.id === pd.id
                                      ? {
                                          ...i,
                                          check: newCheckState,
                                          versions: i.versions.map((vs) => ({
                                            ...vs,
                                            check: newCheckState,
                                          })),
                                        }
                                      : i
                                  )
                                );
                              }}
                            />}
                          </td>
                          <td className="col-1">
                            <img
                              src={pd.image}
                              alt={"No"}
                              style={{ width: 35, height: 35 }}
                            />
                          </td>
                          <td className="col-10">
                            <p className="text-start">{pd.productName}</p>
                          </td>
                        </tr>

                        {pd.versions.length > 0 &&
                          pd.versions.map((vs, index) => {
                            return (
                              <tr
                                className="row"
                                key={index}
                              >
                                <td className="col-11 offset-1">
                                  <tr
                                    className="row"
                                    style={{ cursor: "pointer" }}
                                    onClick={(e) => {
                                      e.stopPropagation(); // Ngăn xung đột
                                      if (vs.sale) {
                                        return;
                                      }
                                      const versionUpdate = pd.versions.map(
                                        (i) => {
                                          return i.id === vs.id
                                            ? {
                                                ...i,
                                                check: !vs.check,
                                              }
                                            : i;
                                        }
                                      );

                                      const allVersionsNowChecked =
                                        versionUpdate.every((v) => v.check);

                                      setProducts(
                                        products.map((i) =>
                                          i.id === pd.id
                                            ? {
                                                ...i,
                                                versions: [...versionUpdate],
                                                check: allVersionsNowChecked,
                                              }
                                            : i
                                        )
                                      );
                                    }}
                                  >
                                    <td className="col-1">
                                      {vs.sale ? (
                                        ""
                                      ) : (
                                        <input
                                          style={{ cursor: "pointer" }}
                                          className="form-check-input"
                                          type="checkbox"
                                          checked={vs.check || false}
                                          onClick={(e) => e.stopPropagation()} // Ngăn chặn xung đột với thẻ <tr>
                                          onChange={(e) => {
                                            const versionUpdate =
                                              pd.versions.map((i) => {
                                                return i.id === vs.id
                                                  ? {
                                                      ...i,
                                                      check: e.target.checked,
                                                    }
                                                  : i;
                                              });

                                            const allVersionsNowChecked =
                                              versionUpdate.every(
                                                (v) => v.check
                                              );

                                            setProducts(
                                              products.map((i) =>
                                                i.id === pd.id
                                                  ? {
                                                      ...i,
                                                      versions: [
                                                        ...versionUpdate,
                                                      ],
                                                      check:
                                                        allVersionsNowChecked,
                                                    }
                                                  : i
                                              )
                                            );
                                          }}
                                        />
                                      )}
                                    </td>
                                    <td className="col-9">
                                      {vs?.attributes
                                        .map((i) => i.value)
                                        .join(" - ")}

                                      {vs.sale ? (
                                        <span className="badge bg-label-primary mx-2">
                                          Chương trình{" "}
                                          {vs.saleName + " (Đang áp dụng)"}
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </td>
                                  </tr>
                                </td>
                              </tr>
                            );
                          })}
                      </React.Fragment>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </ModalSft>
    </>
  );
};

export default AddSale;

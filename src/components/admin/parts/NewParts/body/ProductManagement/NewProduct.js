import React, { useEffect, useRef, useState, version } from "react";
import AvatarUpload from "../../../../AvatarUpload ";
import { stfExecAPI } from "../../../../../../stf/common";
import { toast } from "react-toastify";
import FullScreenSpinner from "../../../FullScreenSpinner";
import DataTableSft from "../../../../DataTableSft";
import ModalSft from "../../../../ModalSft";
import { TagsInput } from "react-tag-input-component";
import {
  Trash,
  ImageSquare,
  FloppyDiskBack,
  Article,
  PlusCircle,
} from "phosphor-react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const NewProduct = () => {
  const [file, setFile] = useState(null);
  const [productName, setProductName] = useState("");
  const [discription, setDiscription] = useState("");
  const [cate, setCate] = useState([]);
  const [catId, setCatId] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [allPrice, setAllPrice] = useState("");
  const [isModalAttribute, setIsModalAttribute] = useState(false);
  const [isModalOption, setIsModalOption] = useState(false);
  const [listThuocTinh, setListThuocTinh] = useState([]);
  const [listOption, setListOption] = useState([]);
  const [attributeName, setAttributeName] = useState("");
  const [idAttribute, setIdAttribute] = useState();

  //Các hàm xử lý logic
  const handleDelete = (record) => {
    setDataSource(dataSource.filter((i) => i.id !== record.id));
  };

  const handleOkModalAttribute = async () => {
    if (attributeName.trim().length <= 0) {
      toast.error(`Tên thuộc tính không được để trống`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    const duplicateName = attributes.find(i=>  i.attributeName.trim().toLocaleLowerCase() === attributeName.trim().toLowerCase());
    if(duplicateName){
      toast.error(`Tên thuộc tính đã tồn  tại`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (listThuocTinh.length === 0) {
      toast.error(`Giá trị thuộc tính không được để trống`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    const hasDuplicates =
      new Set(listThuocTinh.map((i) => i.trim())).size !== listThuocTinh.length;

    if (hasDuplicates) {
      toast.error(`Giá trị thuộc tính không được trùng`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    const dat = { attibuteName: attributeName, options: listThuocTinh };

    setLoading(true);

    const [error, data] = await stfExecAPI({
      method: "post",
      url: `api/staff/attribute/option/add`,
      data: dat,
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

    const fetchProducts = async () => {
      const [error, data] = await stfExecAPI({
        url: `api/staff/attribute/all`,
      });

      if (data) {
        setAttributes(
          data.data.map((i) => {
            return {
              ...i,
              // options: [{ id: 0, value: "Thêm giá trị" }, ...i.options],
            };
          })
        );
        return;
      }
    };

    fetchProducts();

    toast.success(`Thành công`, {
      className: "toast-message",
      position: "top-right",
      autoClose: 5000,
    });

    setAttributeName("");
    setListThuocTinh([]);

    setLoading(false);
    setIsModalAttribute(false);
  };

  const handleCancelModalAttribute = () => {
    setAttributeName("");
    setListThuocTinh([]);
    setIsModalAttribute(false);
  };

  const handleOkModalOption = async () => {

    if (listOption.length === 0) {
      toast.error(`Giá trị thuộc tính không được để trống`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    const hasDuplicates =
      new Set(listOption.map((i) => i.trim())).size !== listOption.length;

    if (hasDuplicates) {
      toast.error(`Giá trị thuộc tính không được trùng`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    const dat = { attributeId: idAttribute, optionName: listOption };

    setLoading(true);

    const [error, data] = await stfExecAPI({
      method: "post",
      url: `api/staff/attribute/option/add-option`,
      data: dat,
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

    const fetchProducts = async () => {
      const [error, data] = await stfExecAPI({
        url: `api/staff/attribute/all`,
      });

      if (data) {
        setAttributes(
          data.data.map((i) => {
            return {
              ...i,
              // options: [{ id: 0, value: "Thêm giá trị" }, ...i.options],
            };
          })
        );
        return;
      }
    };

    fetchProducts();

    toast.success(`Thành công`, {
      className: "toast-message",
      position: "top-right",
      autoClose: 5000,
    });

    setIdAttribute(-1);
    setListOption([]);

    setLoading(false);
    setIsModalOption(false);
  };

  const handleCancelModalOption = () => {
    setListOption([]);
    setIsModalOption(false);
  };

  const generateProductVersions = (options) => {
    const attributeKeys = Object.keys(options);

    // Lấy tất cả các giá trị đã chọn từ từng thuộc tính
    const attributeValues = attributeKeys.map((key) =>
      options[key].map((opt) => opt.label)
    );

    // Lấy tất cả các kết hợp có thể giữa các thuộc tính
    const combinations = cartesianProduct(attributeValues);

    // Tạo mảng dataSource mới
    const newDataSource = combinations.map((combination, index) => {
      const versionName = `${productName} - ${combination.join(" - ")}`;

      // Tạo mảng attributes cho từng phiên bản
      const attributes = attributeKeys.map((key, attrIndex) => {
        // Tìm option tương ứng với giá trị trong combination
        const selectedOption = options[key].find(
          (opt) => opt.label === combination[attrIndex]
        );

        return {
          id: selectedOption?.value, // Sử dụng `value` làm `id` của thuộc tính
          value: combination[attrIndex],
          key: "",
        };
      });

      return {
        id: index + 1,
        versionName,
        image: "",
        retalPrice: "",
        importPrice: "",
        attributes,
      };
    });

    setDataSource(newDataSource);
  };

  const cartesianProduct = (arrays) => {
    return arrays.reduce(
      (acc, array) =>
        acc.flatMap((accItem) => array.map((item) => [...accItem, item])),
      [[]]
    );
  };

  //Thêm sản phẩm
  const handleClickAdd = async () => {
    if (productName.trim().length === 0) {
      toast.error(`Tên sản phẩm không được bỏ trống`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (catId === -1) {
      toast.error(`Vui lòng chọn loại sản phẩm`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (!file) {
      toast.error(`Vui lòng chọn ảnh cho sản phẩm`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (dataSource.length === 0) {
      toast.error(`Vui lòng chọn ít nhất một thuộc tính cho sản phẩm`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (dataSource.find((i) => i.image.trim().length === 0)) {
      toast.error(`Vui lòng chọn hình ảnh cho tất cả các phiên bản`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    setLoading(true);
    const versions = dataSource.map((i) => {
      i = { ...i, images: [i.image.split(",")[1]] };
      const { image, id, ...newDataSource } = i;

      return newDataSource;
    });

    const [error, data] = await stfExecAPI({
      method: "post",
      url: "api/staff/product/add",
      data: {
        name: productName,
        price: 300000,
        image: file.split(",")[1],
        description: discription,
        categories: [
          {
            id: catId,
            name: "",
          },
        ],
        versions,
      },
    });

    setLoading(false);
    if (error) {
      const err =
        error.status === 403
          ? "Bạn không có đủ phân quyền để thực thi công việc này !"
          : error?.response?.data?.message;

      toast.error(`${err}`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      console.log(error);
      return;
    }

    toast.success(`Thành công`, {
      className: "toast-message",
      position: "top-right",
      autoClose: 5000,
    });
  };

  //Cấu hình table
  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (text, record) => {
        return (
          <div style={{ position: "relative" }}>
            {!text ? (
              <div
                onClick={() =>
                  document.getElementById(`file-input-${record.id}`).click()
                }
              >
                <ImageSquare
                  style={{ color: "#8592a3", cursor: "pointer" }}
                  size={35}
                  weight="light"
                />
              </div>
            ) : (
              // Nếu có ảnh, hiển thị ảnh và cho phép click để thay đổi
              <img
                src={text}
                alt="Product"
                style={{ width: 50, height: 50, cursor: "pointer" }}
                onClick={() =>
                  document.getElementById(`file-input-${record.id}`).click()
                }
              />
            )}

            {/* Input file ẩn khi click vào biểu tượng ImageSquare hoặc ảnh */}
            <input
              type="file"
              id={`file-input-${record.id}`}
              hidden
              accept="image/png, image/jpeg"
              onChange={async (e) => {
                const imgBase64 = await convertToBase64(e.target.files[0]);
                const updatedDataSource = dataSource.map((d) => {
                  if (d.id === record.id) {
                    return { ...d, image: imgBase64 };
                  }
                  return d;
                });
                setDataSource(updatedDataSource);
              }}
            />
          </div>
        );
      },
    },
    {
      title: "Tên phiên bản",
      dataIndex: "versionName",
      key: "versionName",
      render: (value, record) => {
        return (
          <input
            type="text"
            className="form-control"
            id="basic-default-fullname"
            placeholder="Enter name"
            value={value}
            onChange={(e) => {
              const versions = dataSource.map((d) => {
                if (d.id === record.id) {
                  return { ...d, versionName: e.target.value };
                }

                return d;
              });

              setDataSource(versions);
            }}
          />
        );
      },
    },
    {
      title: "Giá phiên bản",
      dataIndex: "retalPrice",
      key: "retalPrice",
      render: (value, record) => {
        return (
          <input
            type="text"
            className="form-control w-50"
            id="basic-default-fullname"
            placeholder="Nhập giá"
            value={value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            onChange={(e) => {
              const inputValue = e.target.value;

              // Chỉ giữ lại các ký tự là số
              const numericValue = inputValue.replace(/\D/g, "");
              const newPrice = numericValue;

              const updatedDataSource = dataSource.map((d) => {
                return record.id === d.id ? { ...d, retalPrice: newPrice } : d;
              });

              setDataSource(updatedDataSource);
            }}
          />
        );
      },
    },
    {
      title: "Thuộc tính",
      dataIndex: "attributes",
      key: "attributes",
      render: (value, record) => {
        return record.attributes
          .map((i) => {
            return i.value;
          })
          .join(", ");
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
              onClick={() => handleDelete(record)}
            >
              <Trash weight="fill" />
            </button>
          </div>
        );
      },
    },
  ];

  //Đổ danh sách danh mục sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      const [error, data] = await stfExecAPI({
        url: `api/staff/attribute/all`,
      });

      if (data) {
        setAttributes(
          data.data.map((i) => {
            return {
              ...i,
              // options: [{ id: 0, value: "Thêm giá trị" }, ...i.options],
            };
          })
        );
        return;
      }

      const err =
        error.status === 403
          ? "Bạn không có đủ phân quyền để thực thi công việc này !"
          : error?.response?.data?.message;

      toast.error(`${err}`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
    };

    fetchProducts();
  }, []);

  //Đổ danh sách thuộc tính sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      const [error, data] = await stfExecAPI({
        url: `api/home/category/dashboard/get-all`,
      });

      if (data) {
        setCate(data.data);
        return;
      }

      const err =
        error.status === 403
          ? "Bạn không có đủ phân quyền để thực thi công việc này !"
          : error?.response?.data?.message;

      toast.error(`${err}`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
    };

    fetchProducts();
  }, []);

  // Hàm nhận file từ component con
  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile) {
      setFile(null);
      return;
    }

    try {
      const base64String = await convertToBase64(selectedFile);
      setFile(base64String); // Lưu chuỗi Base64 vào state
    } catch (error) {
      console.error("Lỗi chuyển đổi file:", error);
    }
  };

  return (
    <>
      <FullScreenSpinner isLoading={loading} />

      <form className="card p-4">
        <div className="row">
          <label>Sản phẩm</label>
        </div>

        <div className="row">
          <div className="col-md-5">
            <AvatarUpload
              marginRight="260px"
              pathImage={""}
              onFileSelect={handleFileSelect}
            />
          </div>

          <div className="col-md-7">
            <div className="row mb-4">
              <div className="col-md-12">
                <label className="mb-2" htmlFor="basic-default-fullname">
                  Tên sản phẩm <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="basic-default-fullname"
                  placeholder="Nhập tên sản phẩm"
                  value={productName}
                  onChange={(e) => {
                    dataSource.length > 0 &&
                      setDataSource(
                        dataSource.map((i) => {
                          const name =
                            e.target.value +
                            i.versionName.substring(
                              i.versionName.indexOf(" -"),
                              i.versionName.length
                            );

                          return { ...i, versionName: name };
                        })
                      );

                    setProductName(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="row  mb-4">
              <div className="col-md-12">
                <label
                  htmlFor="exampleFormControlSelect1"
                  className="mb-2"
                >
                  Loại sản phẩm <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  id="exampleFormControlSelect1"
                  value={catId}
                  onChange={(e) => {
                    setCatId(e.target.value);
                  }}
                >
                  <option value="-1">Chọn loại sản phẩm</option>
                  {cate &&
                    cate.map((c, index) => {
                      return (
                        <option key={c.categoryName} value={c.categoryId}>
                          {c.categoryName}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <label for="exampleFormControlTextarea1" class="mb-2">
                  Mô tả
                </label>
                <textarea
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  placeholder="Nhập mô tả"
                  rows="3"
                  value={discription}
                  onInput={(e) => setDiscription(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Modal thêm thuộc tính */}
      <ModalSft
        title="Thuộc tính"
        titleOk={"Thêm"}
        open={isModalAttribute}
        onOk={handleOkModalAttribute}
        onCancel={handleCancelModalAttribute}
        size="modal-lg"
      >
        <div className="row">
          <div className="col-4">
            <label className="mb-2">Tên thuộc tính</label>
            <input
              type="text"
              className="form-control"
              id="basic-default-fullname"
              placeholder="Nhập tên thuộc tính"
              value={attributeName}
              onChange={(e) => {
                setAttributeName(e.target.value);
              }}
            />
          </div>

          <div className="col-8">
            <label className="mb-1">Giá trị</label>

            <TagsInput
              value={listThuocTinh}
              onChange={setListThuocTinh}
              name="fruits"
              placeHolder="Nhập xong một giá trị nhấn enter"
            />
          </div>
        </div>
      </ModalSft>

      {/* Modal thêm giá trị option */}
      <ModalSft
        title="Giá trị thuộc tính"
        titleOk={"Thêm"}
        open={isModalOption}
        onOk={handleOkModalOption}
        onCancel={handleCancelModalOption}
        size="modal-lg"
      >
        <div className="row">
          <div className="col-12">
            <label className="mb-1">Giá trị</label>

            <TagsInput
              value={listOption}
              onChange={setListOption}
              name="fruits"
              placeHolder="Nhập xong một giá trị nhấn enter"
            />
          </div>
        </div>
      </ModalSft>

      <form className="card p-4 mt-3">
        <div className="row mb-3">
          <label>
            Thuộc tính{" "}
            <PlusCircle
              onClick={() => {
                setIsModalAttribute(true);
              }}
              size={20}
              style={{ cursor: "pointer" }}
              className="text-primary"
            />{" "}
          </label>
        </div>

        <div className="row row-cols-sm-3 mt-3">
          {attributes &&
            attributes.map((a) => {
              return (
                <div className="col" key={a.id}>
                  <label
                    htmlFor=""
                    className="mb-2"
                  >
                    {a.attributeName}{" "}
                    <PlusCircle
                      onClick={() => {
                        setIsModalOption(true);
                        setIdAttribute(a.id);
                      }}
                      size={20}
                      style={{ cursor: "pointer" }}
                      className="text-primary"
                    />
                  </label>

                  <Select
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    isMulti
                    options={a.options.map((i) => {
                      return { key: a.id, value: i.id, label: i.value };
                    })}
                    value={selectedOptions[a.id] || []} // Lấy các lựa chọn cho Select hiện tại, nếu không có thì mặc định là mảng rỗng
                    onChange={(selected) => {
                      // Cập nhật selectedOptions cho attribute tương ứng
                      setSelectedOptions((prevSelectedOptions) => {
                        const updatedOptions = {
                          ...prevSelectedOptions,
                          [a.id]: selected, // Lưu lựa chọn cho attribute có id là a.id
                        };

                        // Gọi hàm để tạo phiên bản sản phẩm
                        generateProductVersions(updatedOptions);

                        return updatedOptions;
                      });
                    }}
                  />
                </div>
              );
            })}
        </div>

        <div className="row mt-3">
          <div className="col-md-4">
            <label className="mb-2" htmlFor="">
              Giá cho tất cả phiên bản
            </label>
            <div className="row">
              <div className="col-7">
                <input
                  type="text"
                  className="form-control"
                  id="basic-default-fullname"
                  placeholder="Nhập giá"
                  value={
                    allPrice
                      ? Number(allPrice.replace(/,/g, "")).toLocaleString(
                          "en-US"
                        )
                      : ""
                  }
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/,/g, ""); // Loại bỏ dấu phẩy
                    const newValue = rawValue.replace(/\D/g, ""); // Loại bỏ ký tự không phải số
                    setAllPrice(newValue); // Cập nhật giá trị
                  }}
                />
              </div>

              <div className="col-5">
                <button
                  type="button"
                  className="btn  btn-dark"
                  onClick={() => {
                    setDataSource(
                      dataSource.map((i) => {
                        return {
                          ...i,
                          retalPrice: allPrice,
                          importPrice: allPrice,
                        };
                      })
                    );
                  }}
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <DataTableSft dataSource={dataSource} columns={columns} title={""} />
        </div>

        <div className="d-flex justify-content-end mt-3">
          <button
            type="button"
            className="btn btn-dark me-3"
            onClick={handleClickAdd}
          >
            <FloppyDiskBack /> Lưu
          </button>
        </div>
      </form>
    </>
  );
};

export default NewProduct;

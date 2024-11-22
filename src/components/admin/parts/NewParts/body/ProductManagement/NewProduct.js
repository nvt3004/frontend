import React, { useEffect, useRef, useState, version } from "react";
import AvatarUpload from "../../../../AvatarUpload ";
import { stfExecAPI } from "../../../../../../stf/common";
import { toast } from "react-toastify";
import FullScreenSpinner from "../../../FullScreenSpinner";
import DataTableSft from "../../../../DataTableSft";
import { Trash, ImageSquare } from "phosphor-react";
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

  //Các hàm xử lý logic
  const handleDelete = (record) => {
    setDataSource(dataSource.filter((i) => i.id !== record.id));
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
      toast.error(`Product name cannot be blank`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (catId === -1) {
      toast.error(`Please select a category`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (!file) {
      toast.error(`Please select image product`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (dataSource.length === 0) {
      toast.error(`Please select attribute`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (dataSource.find((i) => i.image.trim().length === 0)) {
      toast.error(`Please select full image for all versions`, {
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
          ? "Account does not have permission to perform this function"
          : error?.response?.data?.message;

      toast.error(`${err}`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    toast.success(`Success`, {
      className: "toast-message",
      position: "top-right",
      autoClose: 5000,
    });
  };

  //Cấu hình table
  const columns = [
    {
      title: "Image",
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
      title: "Version Name",
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
      title: "Retail Price",
      dataIndex: "retalPrice",
      key: "retalPrice",
      render: (value, record) => {
        return (
          <input
            type="text"
            className="form-control w-50"
            id="basic-default-fullname"
            placeholder="Enter price"
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
      title: "Import Price",
      dataIndex: "importPrice",
      key: "importPrice",
      render: (value, record) => {
        return (
          <input
            type="text"
            className="form-control w-50"
            id="basic-default-fullname"
            placeholder="Enter price"
            value={value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            onChange={(e) => {
              const inputValue = e.target.value;

              // Chỉ giữ lại các ký tự là số
              const numericValue = inputValue.replace(/\D/g, "");
              const newPrice = numericValue;

              const updatedDataSource = dataSource.map((d) => {
                return record.id === d.id ? { ...d, importPrice: newPrice } : d;
              });

              setDataSource(updatedDataSource);
            }}
          />
        );
      },
    },
    {
      title: "Attributes",
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
      title: "Actions",
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
        setAttributes(data.data);
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
          ? "Account does not have permission to perform this function"
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

  console.log(dataSource);
  return (
    <>
      <FullScreenSpinner isLoading={loading} />

      <form className="card p-4">
        <div className="row">
          <label>Product</label>
        </div>

        <div className="row">
          <div className="col-md-5">
            <AvatarUpload
              marginRight="200px"
              pathImage={""}
              onFileSelect={handleFileSelect}
            />
          </div>

          <div className="col-md-7">
            <div className="row mb-4">
              <div className="col-md-12">
                <label className="form-label" htmlFor="basic-default-fullname">
                  Product name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="basic-default-fullname"
                  placeholder="Enter product name"
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
                  className="form-label"
                >
                  Category <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  id="exampleFormControlSelect1"
                  value={catId}
                  onChange={(e) => {
                    setCatId(e.target.value);
                  }}
                >
                  <option value="-1">Select category</option>
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
                <label for="exampleFormControlTextarea1" class="form-label">
                  Discription
                </label>
                <textarea
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  rows="3"
                  value={discription}
                  onInput={(e) => setDiscription(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </form>

      <form className="card p-4 mt-3">
        <div className="row mb-3">
          <label>Attributes</label>
        </div>

        <div className="row row-cols-sm-3">
          {attributes &&
            attributes.map((a) => {
              return (
                <div className="col" key={a.id}>
                  <label
                    htmlFor="exampleFormControlSelect1"
                    className="form-label"
                  >
                    {a.attributeName}
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
            <label className="form-label" htmlFor="basic-default-fullname">
              Enter price for all version
            </label>
            <input
              type="text"
              className="form-control"
              id="basic-default-fullname"
              placeholder="Enter price"
              value={
                allPrice
                  ? Number(allPrice.replace(/,/g, "")).toLocaleString("en-US")
                  : ""
              }
              onChange={(e) => {
                const rawValue = e.target.value.replace(/,/g, ""); // Loại bỏ dấu phẩy
                const newValue = rawValue.replace(/\D/g, ""); // Loại bỏ ký tự không phải số
                setAllPrice(newValue); // Cập nhật giá trị

                setDataSource(
                  dataSource.map((i) => {
                    return {
                      ...i,
                      retalPrice: newValue,
                      importPrice: newValue,
                    };
                  })
                );
              }}
            />
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
            Save
          </button>
        </div>
      </form>
    </>
  );
};

export default NewProduct;

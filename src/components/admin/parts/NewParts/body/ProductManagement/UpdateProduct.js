import React, { useEffect, useRef, useState, version } from "react";
import AvatarUpload from "../../../../AvatarUpload ";
import { stfExecAPI } from "../../../../../../stf/common";
import { toast } from "react-toastify";
import FullScreenSpinner from "../../../FullScreenSpinner";
import DataTableSft from "../../../../DataTableSft";
import { Trash, ImageSquare, Plus } from "phosphor-react";
import makeAnimated from "react-select/animated";
import { useLocation } from "react-router-dom";
import ModalSft from "../../../../ModalSft";
import Select from "react-select";

const animatedComponents = makeAnimated();

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const UpdateProduct = () => {
  const [file, setFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [discription, setDiscription] = useState("");
  const [cate, setCate] = useState([]);
  const [catId, setCatId] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [versionDelete, setVersionDelete] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [retailPrice, setRetailPrice] = useState("");
  const [importPrice, setImportPrice] = useState("");
  const [product, setProduct] = useState({});
  const location = useLocation();

  //Các hàm xử lý logic
  const handleDelete = (record) => {
    if (record.update) {
      setVersionDelete([...versionDelete, record]);
    }

    setDataSource(dataSource.filter((i) => i.id !== record.id));
  };

  const generateProductVersions = (options) => {
    const attriubuteNames = options.map((o) => o.label).join(" - ");
    const attributesTemp = options.map((i) => {
      return { id: i.value, key: "", value: i.label };
    });

    const test = {
      id: dataSource ? dataSource[dataSource.length - 1].id + 1 : 1,
      idProduct: 0,
      versionName: `${productName} - ${attriubuteNames}`,
      retailPrice: retailPrice,
      importPrice: importPrice,
      active: true,
      quantity: 0,
      image: "",
      attributes: attributesTemp,
    };

    setDataSource([...dataSource, test]);
  };

  const cartesianProduct = (arrays) => {
    return arrays.reduce(
      (acc, array) =>
        acc.flatMap((accItem) => array.map((item) => [...accItem, item])),
      [[]]
    );
  };
  console.log(version);
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

    if (!file && product.image.trim().length === 0) {
      toast.error(`Please select image product`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (dataSource.length === 0) {
      toast.error(`Please select version`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    // if (dataSource.find((i) => i.image.trim().length === 0)) {
    //   toast.error(`Please select full image for all versions`, {
    //     className: "toast-message",
    //     position: "top-right",
    //     autoClose: 5000,
    //   });
    //   return;
    // }

    const pd = {
      id: product.id,
      name: productName,
      price: 0,
      image: file === null ? "" : file.split(",")[1],
      description: discription,
      categories: [
        {
          id: Number(catId),
          name: "",
        },
      ],
    };

    let countCheck = 0;

    const updateProductParent = async () => {
      const [error, data] = await stfExecAPI({
        method: "put",
        url: "api/staff/product/update",
        data: pd,
      });

      if (error) {
        countCheck += 1;
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
    };

    const saveVersion = async () => {
      for (let i = 0; i < dataSource.length; i++) {
        const version = dataSource[i];

        //Nếu đã có rồi thì update
        if (version.update) {
          const vs = {
            id: version.id,
            versionName: version.versionName,
            retailPrice: version.retailPrice,
            importPrice: version.importPrice,
            image: {
              name: version.image.endsWith(".jpg")
                ? ""
                : version.image.split(",")[1], // Nếu cập nhật ảnh mới thì truyền ảnh base 64 lên, còn không cập nhật mà giữ ảnh cũ thì truyền chuỗi rỗng ""
            },
          };
          const [error, data] = await stfExecAPI({
            method: "put",
            url: "api/staff/version/update",
            data: vs,
          });

          if (error) {
            countCheck += 1;
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
        } else {
          // Nếu chưa có thì them csdl
          const vs = {
            idProduct: product.id,
            versionName: version.versionName,
            retailPrice: version.retailPrice,
            importPrice: version.importPrice,
            image: {
              name: version.image.split(",")[1],
            },
            attributes: version.attributes,
          };

          const [error, data] = await stfExecAPI({
            method: "post",
            url: "api/staff/version/add",
            data: vs,
          });

          if (error) {
            countCheck += 1;
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
        }
      }
    };

    const deleteVersionApi = async () => {
      console.log(4343, versionDelete);

      for (let i = 0; i < versionDelete.length; i++) {
        const version = versionDelete[i];

        const [error, data] = await stfExecAPI({
          method: "delete",
          url: `api/staff/version/remove/${version.id}`,
        });

        if (error) {
          countCheck += 1;
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
      }
    };

    await deleteVersionApi();
    if (countCheck !== 0) {
      return;
    }
    await updateProductParent();
    if (countCheck !== 0) {
      return;
    }
    await saveVersion();
    if (countCheck !== 0) {
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
      dataIndex: "retailPrice",
      key: "retailPrice",
      render: (value, record) => {
        return (
          <input
            type="text"
            className="form-control w-50"
            id="basic-default-fullname"
            placeholder="Giá phiên bản"
            value={value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            onChange={(e) => {
              const inputValue = e.target.value;
              // Chỉ giữ lại các ký tự là số
              const numericValue = inputValue.replace(/\D/g, "");
              const newPrice = numericValue;

              const updatedDataSource = dataSource.map((d) => {
                return record.id === d.id ? { ...d, retailPrice: newPrice } : d;
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
          .join(" - ");
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
        url: `api/staff/product/refresh/${location?.state?.product?.id}`,
      });

      if (data) {
        setProduct(data.data);
        setProductName(data.data.productName);
        setCatId(data.data.categories[0].id);
        setDiscription(data.data.discription);
        setDataSource(
          data.data.versions
            .filter((i) => i.active)
            .map((i) => {
              return { ...i, image: i.image.name, update: true };
            })
        );
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

  // Modal thêm mới
  const handleOk = async () => {
    if (Object.keys(selectedOptions).length === 0) {
      toast.error(`Vui lòng chọn thuộc tính`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });

      return;
    }

    if(!retailPrice){
      toast.error(`Vui lòng nhập giá phiên bản`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });

      return;
    }

    generateProductVersions(Object.values(selectedOptions));
    setIsModalOpen(false);
  };

  //Đóng modal
  const handleCancel = () => {
    setIsModalOpen(false); // Đóng modal khi nhấn "Close"
  };

  console.log(dataSource);
  console.log(selectedOptions);
  console.log(versionDelete);

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
              marginRight="200px"
              pathImage={product?.image || ""}
              onFileSelect={handleFileSelect}
            />
          </div>

          <div className="col-md-7">
            <div className="row mb-4">
              <div className="col-md-12">
                <label className="mb-2" htmlFor="">
                  Tên sản phẩm <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="basic-default-fullname"
                  placeholder="Enter product name"
                  value={productName}
                  onChange={(e) => {
                    setProductName(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="row  mb-4">
              <div className="col-md-12">
                <label htmlFor="" className="mb-2">
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
                <label for="" class="mb-2">
                  Mô tả
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
        <div className="">
          <button
            type="button"
            className="btn btn-dark me-3"
            onClick={() => {
              setSelectedOptions({});
              setIsModalOpen(true);
              setRetailPrice("");
              setImportPrice("");
            }}
          >
            Thêm phiên bản <Plus weight="fill" />
          </button>
        </div>

        <div className="row">
          <DataTableSft dataSource={dataSource} columns={columns} title={""} />
        </div>

        <div className="d-flex justify-content-end mt-3">
          <button
            type="button"
            className="btn btn-outline-secondary me-3"
            onClick={() => {
              setDataSource(dataSource.filter((i) => i.update));
              setVersionDelete([]);
            }}
          >
            Làm lại
          </button>

          <button
            type="button"
            className="btn btn-dark me-3"
            onClick={handleClickAdd}
          >
            Lưu
          </button>
        </div>
      </form>

      <ModalSft
        title="Thêm phiên bản"
        titleOk={"Add"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        size="modal-lg"
      >
        <form className="card p-4 mt-3">
          <div className="row mb-3">
            <label>Thuộc tính</label>
          </div>

          <div
            className={`row row-cols-sm-${
              attributes.length % 2 === 0 ? "3" : "2"
            }`}
          >
            {attributes &&
              attributes.map((a) => {
                return (
                  <div className="col mb-3" key={a.id}>
                    <label
                      htmlFor="exampleFormControlSelect1"
                      className="form-label"
                    >
                      {a.attributeName}
                    </label>

                    <Select
                      closeMenuOnSelect={false}
                      components={animatedComponents}
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

                          return updatedOptions;
                        });
                      }}
                    />
                  </div>
                );
              })}

            <div className="col mb-3">
              <label className="form-label" htmlFor="basic-default-fullname">
                Giá phiên bản
              </label>
              <input
                type="text"
                className="form-control"
                id="basic-default-fullname"
                placeholder="Giá phiên bản"
                value={
                  retailPrice
                    ? Number(retailPrice.replace(/,/g, "")).toLocaleString(
                        "en-US"
                      )
                    : ""
                }
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/,/g, ""); // Loại bỏ dấu phẩy
                  const newValue = rawValue.replace(/\D/g, ""); // Loại bỏ ký tự không phải số
                  setRetailPrice(newValue); // Cập nhật giá trị

                  setDataSource(
                    dataSource.map((i) => {
                      return { ...i, retalPrice: newValue };
                    })
                  );
                }}
              />
            </div>
          </div>
        </form>
      </ModalSft>
    </>
  );
};

export default UpdateProduct;

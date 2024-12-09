import React, { useEffect, useState } from "react";
import TableProductStf from "./TableProductSft";
import { useNavigate } from "react-router-dom";
import PaginationSft from "../../../../PaginationSft";
import { stfExecAPI } from "../../../../../../stf/common";
import { toast } from "react-toastify";
import FullScreenSpinner from "../../../FullScreenSpinner";
import { Plus } from "phosphor-react";

const ProductTable = () => {
  const [products, setProducts] = useState({});
  const [cate, setCate] = useState([]);
  const [catId, setCatId] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  //Đổ danh sách user
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const [error, data] = await stfExecAPI({
       url: `api/staff/product?page=1`, 
      });

      if (data) {
        setLoading(false);
        setProducts(data.data);
        return;
      }

      setLoading(false);
      const err =
        error.status === 403
          ? "Bạn không có đủ phân quyền để thực thi công việc này !"
          : error?.response?.data?.message;
      
      toast.error(`${err}`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      console.log(err);
      
    };

    fetchUsers();
  }, []);

  //Đổ danh sách danh mục sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      const [error, data] = await stfExecAPI({
        url: `api/home/category/dashboard/get-all`,
      });

      if (data) {
        setLoading(false);
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
      console.log(err);
    };

    fetchProducts();
  }, []);

  //Các hàm xử lý logic

  //Click thêm mới sản phẩm
  const handleClickAdd = () => {
    navigate("/admin/products/new");
  };

  //Change trạng thái lọc
  const handleChangeSelectFilterActive = async (value) => {
    const fetchUsers = async () => {
      setLoading(true);

      const [error, data] = await stfExecAPI({
        url: `api/staff/product?page=${1}&keyword=${keyword}&idCat=${value}`,
      });

      if (data) {
        setLoading(false);
        setProducts(data.data);
        return;
      }

      setLoading(false);
      const err =
        error.status === 403
          ? "Bạn không có đủ phân quyền để thực thi công việc này !"
          : error?.response?.data?.message;

      toast.error(`${err}`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      console.log(err);
    };

    fetchUsers();
  };

  //Change page
  const onChangePagination = async (page) => {
    setLoading(true);

    const [error, data] = await stfExecAPI({
      url: `api/staff/product?page=${page}&keyword=${keyword}&idCat=${catId}`,
    });

    setLoading(false);
    if (data) {
      setProducts(data.data);
    }
  };

  //Cấu hình table
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (text, record) => {
        return <img src={text} alt={"No"} style={{ width: 50, height: 50 }} />;
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
      render: (text, record) => {
        return (
          <span
            style={{
              color: "#6610f2",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => {
              navigate("/admin/products/update", {
                state: { product: record },
              });
            }}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: "Tồn kho",
      dataIndex: "totalStock",
      key: "totalStock",
      render: (text, record) => {
        if (text <= 0) {
          return (
            <span class="badge bg-label-danger me-1" style={{ width: "110px" }}>
              Hết hàng
            </span>
          );
        } else {
          return (
            <span class="badge bg-label-success me-1" style={{ width: "110px" }}>
              {`Còn hàng: ${text}`}
            </span>
          );
        }
      },
    },
    { title: "Mô tả", dataIndex: "discription", key: "discription" },
  ];

  const btnTable = () => {
    return (
      <div className="d-flex">
        <button className="btn btn-dark me-3" onClick={handleClickAdd}>
          Thêm mới <Plus weight="fill" />
        </button>

        <select
          className="form-select w-25"
          id="exampleFormControlSelect1"
          onChange={(e) => {
            handleChangeSelectFilterActive(e.target.value);
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
    );
  };

  const handleChangeInputSearchOnTable = async (
    value,
    currentCatId = catId
  ) => {
    setKeyword(value);
    setLoading(true);

    const [error, data] = await stfExecAPI({
      url: `api/staff/product?page=${
        (products?.number || 0) + 1
      }&keyword=${value}&idCat=${currentCatId}`,
    });

    setLoading(false);
    if (data) {
      setProducts(data.data);
    } else {
      const err =
        error.status === 403
          ? "Bạn không có đủ phân quyền để thực thi công việc này !"
          : error?.response?.data?.message;

      toast.error(`${err}`, {
        className: "toast-message",
        position: "top-right",
        autoClose: 5000,
      });
      console.log(err);
      setProducts({});
    }
  };

  return (
    <>
      <FullScreenSpinner isLoading={loading} />
      <TableProductStf
        dataSource={products?.content || []}
        columns={columns}
        title="Danh sách sản phẩm"
        isSearch={true}
        onChangeSearch={(value) => handleChangeInputSearchOnTable(value, catId)}
        buttonTable={btnTable()}
      />

      <div className="d-flex justify-content-end align-items-center mt-3">
        {products.totalPages > 1 && (
          <PaginationSft
            count={products.totalPages}
            defaultPage={(products.number || 0) + 1}
            siblingCount={1}
            onPageChange={onChangePagination}
          />
        )}
      </div>
    </>
  );
};

export default ProductTable;

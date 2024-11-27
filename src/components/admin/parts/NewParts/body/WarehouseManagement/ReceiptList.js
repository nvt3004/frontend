import React, { useEffect, useState } from "react";
import {
  Button,
  Collapse,
  Form,
  InputGroup,
  Pagination,
  Table,
} from "react-bootstrap";
import { FaFileExport, FaPlus, FaSearch } from "react-icons/fa";
import { RiFileList2Fill } from "react-icons/ri";
import axiosInstance from "../../../../../../services/axiosConfig";
import NotSelectYet from "../../component/errorPages/NotSelectYet";
import { isElement } from "react-dom/test-utils";
import { motion } from "framer-motion";
import { stfExecAPI } from "../../../../../../stf/common";
import { toast } from "react-toastify";

const ReceiptList = () => {
  const [receipts, setReceipt] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(10);


  //Đổ danh sách nhà cung cấp
  useEffect(() => {
    const fetchUsers = async () => {
      const [error, data] = await stfExecAPI({
        url: `api/staff/receipt?page=${currentPage}&size=${pageSize}`,
      });

      if (data) {
        setReceipt(data?.data?.content);
        setTotalPage(data?.data?.totalPages);
        setTotalElements(data?.data?.totalElements);
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

    fetchUsers();
  }, [currentPage]);

  const handleSetPage = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const paginationItems = [];
  for (let number = 0; number < totalPage; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => handleSetPage(number)}
      >
        {number + 1}
      </Pagination.Item>
    );
  }

  const [selectedReceiptID, setSelectedReceiptID] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  useEffect(() => {
    if (selectedReceiptID) {
      axiosInstance
        .get(`/staff/receipt/receipt-detail?id=${selectedReceiptID}`)
        .then((response) => {
          if (response?.data?.errorCode === 200) {
            setSelectedReceipt(response?.data?.data);
          }
        });
    }
  }, [selectedReceiptID]);
  useEffect(() => {
    console.log("selected receipt: ", selectedReceipt);
  }, [selectedReceipt]);

  return (
    <div>
      <div className="font-14">
        <div
          className="bg-body-tertiary d-flex align-items-center"
          style={{ height: "50px" }}
        >
          <div className="container d-flex justify-content-between align-items-center">
            <h4 className="m-0 col-2 d-flex align-items-center" style={{ minWidth: '250px' }}>
              <RiFileList2Fill />
              &ensp;Đơn nhập hàng
            </h4>
            <div className="col-10 d-flex justify-content-around">
              <InputGroup className="w-30" style={{ maxWidth: '450px' }}>
                <InputGroup.Text className="custom-radius">
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  className="custom-radius"
                  placeholder="Tìm kiếm đơn nhập hàng . . ."
                />
              </InputGroup>
              <Button
                variant="secondary"
                className="font-14 custom-radius custom-hover"
              >
                <FaFileExport /> {` Xuất`}
              </Button>
            </div>
          </div>
        </div>
        <div className="d-flex mt-3">
          <div className="col-9 pe-5">
            <div>
              <Table striped hover>
                <thead>
                  <th>#</th>
                  <th>Nhà cung cấp</th>
                  <th>Ngày tạo</th>
                  <th>Tạo bởi</th>
                </thead>
                <tbody>
                  {receipts?.map((item, index) => (
                    <tr
                      key={item?.receiptId}
                      onClick={() => {
                        setSelectedReceiptID(item?.receiptId);
                      }}
                    >
                      <td>{index + 1}</td>
                      <td>{item?.supplierName}</td>
                      <td>{item?.receiptDate}</td>
                      <td>{item?.username}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="bg-body-tertiary d-flex justify-content-between align-items-center container pt-2">
              <p className="font-13">
                {`${currentPage * 5 + 5 <= totalElements
                  ? currentPage * 5 + 5
                  : totalElements
                  } / ${totalElements} `}
                {
                  totalPage > 1 && (
                    <span>
                      <motion.a
                        initial={{ color: "#29B6F6" }}
                        className="text-decoration-none fw-medium"
                        onClick={() => {
                          setPageSize(totalElements);
                        }}
                      >{`View all >`}</motion.a>
                    </span>
                  )
                }
              </p>
              {totalPage > 1 &&
                (
                  <Pagination className="border-0">
                    <Pagination.First
                      onClick={() => handleSetPage(0)}
                    >{`<`}</Pagination.First>
                    {paginationItems}
                    <Pagination.Last
                      onClick={() => handleSetPage(totalPage - 1)}
                    >{`>`}</Pagination.Last>
                  </Pagination>
                )
              }
            </div>
          </div>
          <div className="col-3">
            <div className="border bg-white rounded-1">
              <div className="m-1">
                {selectedReceipt ? (
                  <Form className="text-black">
                    <Form.Label>{`Receipt ID: ${selectedReceipt?.receiptId}`}</Form.Label>
                    <Form.Label>{`Supplier: ${selectedReceipt?.supplierName}`}</Form.Label>
                    <Form.Label>{`Created date: ${selectedReceipt?.receiptDate}`}</Form.Label>
                    <Form.Label>{`Detail:`}</Form.Label>
                    {selectedReceipt?.receiptDetailDTO?.map((item, index) => (
                      <div
                        className="ms-3 mb-2"
                        key={index}
                        style={{ maxHeight: "550px", overflowY: "auto" }}
                      >
                        <img
                          src={`${item?.productVersionDTO?.versionImage}`}
                          alt={`${item.productVersionDTO.productVersionName}`}
                          style={{ maxWidth: "80px", height: "auto" }}
                        />
                        <Form.Label className="mb-0">{`Product: ${item.productVersionDTO.productVersionName}`}</Form.Label>
                        <Form.Label>{`Quantity: ${item.quantity}`}</Form.Label>
                      </div>
                    ))}
                  </Form>
                ) : (
                  <NotSelectYet
                    text={`Chưa có đơn nhập hàng nào được chọn để xem chi tiết !!`}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptList;

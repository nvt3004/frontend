import React, { useEffect, useState } from "react";
import { Button, Pagination, Modal } from "react-bootstrap";
import axiosInstance from "../../../../../../services/axiosConfig";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DataTableSft from "../../../../DataTableSft";
import FullScreenSpinner from "../../../FullScreenSpinner";

const AdvertisementTable = () => {
  const [loading, setLoading] = useState(false);
  const [advertisements, setAdvertisements] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [showDeleteModal, setShowDeleteModal] = useState(false); // State to manage the modal
  const [advertisementToDelete, setAdvertisementToDelete] = useState(null); // State to hold advertisement ID to delete

  const navigate = useNavigate(); // Initialize useNavigate

  const columns = [
    { title: "Mã", dataIndex: "advId", key: "advId" },
    { title: "Tên quảng cáo", dataIndex: "advName", key: "advName" },
    {
      title: "Mô tả",
      dataIndex: "advDescription",
      key: "advDescription",
    },
    { title: "Ngày tạo", dataIndex: "startDate", key: "startDate" },
    { title: "Ngày xóa", dataIndex: "endDate", key: "endDate" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value) => (value === 1 ? "Hoạt động" : "Không hoạt động"),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (text, record) => (
        <div>
          <Button
          className="me-2"
            variant="info"
            onClick={() => handleEditAdvertisement(record.advId)}
          >
            Sửa
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDeleteClick(record.advId)} // Open the modal when delete button is clicked
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  const handleGetAdvertisementAPI = () => {
    setLoading(true);
    axiosInstance
      .get(`/staff/advertisement?page=${currentPage + 1}&size=5`)
      .then((response) => {
        if (response?.data?.code === 1000) {
          const mappedAdvertisements = response.data.result.content.map(
            (advertisement) => ({
              advId: advertisement.advId,
              advName: advertisement.advName,
              advDescription: advertisement.advDescription,
              startDate: advertisement.startDate,
              endDate: advertisement.endDate,
              status: advertisement.status,
            })
          );
          setAdvertisements(mappedAdvertisements);
          setTotalPage(response?.data?.result?.totalPages);
          setTotalElements(response?.data?.result?.totalElements);
        }
      })
      .catch((error) => {
        toast.error("Xảy ra lỗi");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleGetAdvertisementAPI();
  }, [currentPage]);

  const handleSetPage = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handleEditAdvertisement = (advId) => {
    axiosInstance
      .get(`/staff/advertisement/id?id=${advId}`)
      .then((response) => {
        if (response?.data?.code === 1000) {
          const advertisement = response.data.result;
          navigate("/admin/advertisement/new", {
            state: { advertisement: advertisement },
          });
        } else {
          toast.error("Không thể lấy chi tiết quảng cáo.");
        }
      })
      .catch((error) => {
        toast.error("Đã xảy ra lỗi khi lấy chi tiết quảng cáo.");
      });
  };

  const handleDeleteClick = (advId) => {
    setAdvertisementToDelete(advId); // Store the advertisement ID to delete
    setShowDeleteModal(true); // Show the confirmation modal
  };

  const handleDeleteAdvertisement = () => {
    axiosInstance
      .delete(`/staff/advertisement?id=${advertisementToDelete}`)
      .then((response) => {
        if (response?.data?.code === 1000) {
          toast.success("Xóa thành công!");
          handleGetAdvertisementAPI();
        } else {
          toast.error("Có lỗi khi xóa.");
        }
      })
      .catch((error) => {
        toast.error("Có lỗi xảy ra trong quá trình xóa.");
      })
      .finally(() => {
        setShowDeleteModal(false); // Close the modal after the delete operation
      });
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false); // Close modal without performing any action
  };

  return (
    <div>
      <FullScreenSpinner isLoading={loading} />
      <DataTableSft
        columns={columns}
        title={"Danh sách quảng cáo"}
        dataSource={advertisements}
        buttonTable={
          <Button
            variant="dark"
            onClick={() => navigate("/admin/advertisement/new")}
          >
            Thêm mới
          </Button>
        }
      />
      <div className="bg-body-tertiary d-flex justify-content-between align-items-center container pt-2">
        <p className="font-13">
          {`${Math.min(currentPage * 5 + 5, totalElements)} of ${totalElements}`}
        </p>

        {totalPage > 1 && (
          <Pagination className="border-0">
            <Pagination.First>{"<"}</Pagination.First>
            {[...Array(totalPage).keys()].map((number) => (
              <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => handleSetPage(number)}
              >
                {number + 1}
              </Pagination.Item>
            ))}
            <Pagination.Last>{">"}</Pagination.Last>
          </Pagination>
        )}
      </div>

      {/* Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc muốn xóa quảng cáo này ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteAdvertisement}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default AdvertisementTable;

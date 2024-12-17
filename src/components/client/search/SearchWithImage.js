import React, { useState } from "react";
import productApi from "../../../services/api/ProductApi";

const SearchWithImage = ({
  isOpen,
  setProducts,
  setImage,
  image,
  closeModal,
  setHasMoreProducts,
  handleClearFilter
}) => {
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file); // Gán ảnh được chọn
      handleSearch(file); // Gọi tìm kiếm ngay sau khi ảnh được chọn
    }
  };

  const handleSearch = async (imageFile) => {
    if (imageFile) {
      setLoading(true); // Hiển thị trạng thái loading
      try {
        const result = await productApi.searchProductByImage(imageFile);
        setProducts(result.data || []); // Cập nhật sản phẩm sau khi tìm kiếm
        closeModal();
      } catch (error) {
        console.error("Error searching products:", error);
      } finally {
        setLoading(false); // Ẩn trạng thái loading
        setHasMoreProducts(false);
      }
    }
  };

  return (
    isOpen && (
      <div
        className="modal fade show"
        tabIndex="-1"
        role="dialog"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.7)" }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content shadow-lg rounded-4">
            {/* Header */}
            <div className="modal-header border-0 p-4">
              <h5 className="modal-title text-center w-100 fs-5 fw-bold">
                Tìm Kiếm Bằng Hình Ảnh
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeModal}
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body px-4 pb-4">
              {/* Upload Section */}
              <div className="mb-4 text-center">
                <input
                  type="file"
                  id="hiddenImageInput"
                  style={{ display: "none" }}
                  accept="image/jpeg, image/png, image/jpg"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="hiddenImageInput"
                  className="d-inline-block w-100 p-5 border border-dashed rounded-3 text-muted text-center cursor-pointer shadow-sm"
                  style={{
                    borderColor: "#6c757d",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  {image ? (
                    <div>
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Selected"
                        className="w-100 h-auto mb-3"
                        style={{ maxHeight: "200px", objectFit: "cover" }}
                      />
                      <div className="fw-semibold text-primary">
                        Thay đổi ảnh
                      </div>
                    </div>
                  ) : (
                    <div>
                      <i
                        className="zmdi zmdi-camera"
                        style={{ fontSize: "3rem" }}
                      ></i>
                      <p className="mt-2">Nhấp để chọn ảnh</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default SearchWithImage;

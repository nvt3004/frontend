import React, { useState } from "react";
import productApi from "../../../services/api/ProductApi";

const SearchWithImage = ({
  isOpen,
  setProducts,
  setImage,
  image,
  closeModal,
  setHasMoreProducts,
}) => {
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file); // Gán ảnh được chọn
    }
  };

  const handleSearch = async () => {
    if (image) {
      setLoading(true); // Show loading indicator while fetching
      try {
        const result = await productApi.searchProductByImage(image);
        setProducts(result.data || []); // Update products with the search results (not needed for this version)
      } catch (error) {
        console.error("Error searching products:", error);
      } finally {
        setLoading(false); // Hide loading indicator
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
              <div className="mb-4">
                <label htmlFor="imageInput" className="form-label fw-semibold">
                  Chọn hình ảnh:
                </label>
                <input
                  type="file"
                  className="form-control shadow-sm"
                  id="imageInput"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {/* Preview Selected Image */}
              {image && (
                <div className="mb-4 text-center">
                  <div
                    className="position-relative mx-auto shadow-sm border rounded-3"
                    style={{
                      width: "300px",
                      height: "300px",
                      overflow: "hidden",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Selected"
                      className="w-100 h-100 object-fit-cover"
                    />
                    <button
                      type="button"
                      className="btn btn-danger position-absolute top-0 end-0 m-2 px-2 py-1"
                      onClick={() => setImage(null)}
                    >
                      <i className="zmdi zmdi-close-circle-o"></i>
                    </button>
                  </div>
                </div>
              )}

              {/* Search Button */}
              <div className="text-center">
                <button
                  onClick={handleSearch}
                  className="btn btn-primary w-100 shadow-sm mb-3"
                  disabled={loading || !image}
                >
                  {loading ? "Đang tìm kiếm..." : "Tìm kiếm"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary w-100 shadow-sm"
                  onClick={closeModal}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default SearchWithImage;

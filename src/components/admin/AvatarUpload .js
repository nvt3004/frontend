import React, { useEffect, useState } from "react";
import { UploadSimple } from "phosphor-react";

const AvatarUpload = ({ onFileSelect, pathImage = "", marginRight = "50px" }) => {
  const [previewImage, setPreviewImage] = useState(pathImage);

  // Đồng bộ previewImage khi pathImage thay đổi
  useEffect(() => {
    setPreviewImage(pathImage);
  }, [pathImage]);

  // Xử lý khi chọn file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
        // Gọi callback function và truyền file lên component cha
        onFileSelect(file);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Chỉ cho phép các file JPG hoặc PNG.");
    }
  };

  const handleReset = () => {
    setPreviewImage(pathImage); // Reset lại hình ảnh
    onFileSelect(null); // Reset file ở component cha

    // Reset lại giá trị input file
    const fileInput = document.getElementById("upload");
    if (fileInput) {
      fileInput.value = ""; // Đặt lại giá trị của input file
    }
  };

  return (
    <div className="card-body">
      <div>
        {previewImage.trim().length > 0 ? (
          <img
            src={previewImage}
            alt="user-avatar"
            className="d-block rounded mb-2"
            height="200px"
            width="200px"
            id="uploadedAvatar"
          />
        ) : (
          <div
            className="upload-area d-block rounded mb-2"
            style={{ width: "200px", height: "200px", marginRight }}
          >
            <p>Ảnh trống</p>
          </div>
        )}
        <div className="d-flex justify-content-start align-items-center">
          <label
            htmlFor="upload"
            className="btn btn-dark me-2 mb-4"
            tabIndex="0"
          >
            <span className="d-none d-sm-block d-flex align-items-center">
              <UploadSimple weight="fill" /> <span>Tải lên</span>
            </span>
            <input
              type="file"
              id="upload"
              className="account-file-input"
              hidden
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
            />
          </label>

          <button type="button" className="btn btn-outline-secondary mb-4" onClick={handleReset}>
            Làm lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarUpload;

const ModalSft = ({ title, size ='' ,titleOk, open, onOk, onCancel, children }) => {
  // Kiểm tra xem modal có đang mở không
  if (!open) return null;

  return (
    <div
      className="modal fade show"
      tabIndex="-1"
      style={{ display: "block" }}
      aria-hidden="true"
    >
      <div className={`modal-dialog ${size}`} role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel1">
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onCancel} // Đóng modal khi nhấn nút close
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {children} {/* Nội dung modal truyền từ bên ngoài */}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel} // Đóng modal khi nhấn Cancel
            >
              Hủy
            </button>
            <button
              type="button"
              className="btn btn-dark"
              onClick={onOk} // Xử lý khi nhấn Save changes
            >
              {titleOk}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalSft;

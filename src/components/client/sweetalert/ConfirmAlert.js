import Swal from "sweetalert2";

const ConfirmAlert = async ({ title, text, confirmText, cancelText }) => {
  const result = await Swal.fire({
    title: title || "Bạn có chắc?",
    text: text || "Bạn có chắn thực hiện hành động này!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: confirmText || "Xác nhận",
    cancelButtonText: cancelText || "Hủy",
    customClass: {
      container: 'swal2-container-custom',
    }
  });

  return result.isConfirmed; // Trả về true nếu nhấn xác nhận, false nếu hủy
};

export default ConfirmAlert;

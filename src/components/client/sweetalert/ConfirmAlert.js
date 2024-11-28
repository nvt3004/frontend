import Swal from "sweetalert2";

const ConfirmAlert = async ({ title, text, confirmText, cancelText }) => {
  const result = await Swal.fire({
    title: title || "Are you sure?",
    text: text || "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: confirmText || "Yes, do it!",
    cancelButtonText: cancelText || "Cancel",
    customClass: {
      container: 'swal2-container-custom',
    }
  });

  return result.isConfirmed; // Trả về true nếu nhấn xác nhận, false nếu hủy
};

export default ConfirmAlert;

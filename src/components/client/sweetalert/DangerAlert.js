import Swal from "sweetalert2";

const DangerAlert = ({ title, text }) => {
  return Swal.fire({
    title: title || "Lỗi!",
    text: text || "Xảy ra lỗi!",
    icon: "error",
    confirmButtonText: "OK",
    customClass: {
      container: 'swal2-container-custom',
    }
  });
};

export default DangerAlert;

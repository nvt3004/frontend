import Swal from "sweetalert2";

const SuccessAlert = ({ title, text }) => {
  return Swal.fire({
    title: title || "Thành công!",
    text: text || "Thao tác thành công!",
    icon: "success",
    confirmButtonText: "OK",
    customClass: {
      container: 'swal2-container-custom',
    }
  });
};

export default SuccessAlert;
 
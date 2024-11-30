import Swal from "sweetalert2";

const WarningAlert = ({ title, text }) => {
  return Swal.fire({
    title: title || "Warning!",
    text: text || "Be careful!",
    icon: "warning",
    confirmButtonText: "OK",
    customClass: {
      container: 'swal2-container-custom',
    }
  });
};

export default WarningAlert;

import Swal from "sweetalert2";

const SuccessAlert = ({ title, text }) => {
  return Swal.fire({
    title: title || "Success!",
    text: text || "Operation completed successfully!",
    icon: "success",
    confirmButtonText: "OK",
    customClass: {
      container: 'swal2-container-custom',
    }
  });
};

export default SuccessAlert;
 
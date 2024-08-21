import Swal from "sweetalert2";

const SuccessAlert = ({ title, text }) => {
  return Swal.fire({
    title: title || "Success!",
    text: text || "Operation completed successfully!",
    icon: "success",
    confirmButtonText: "OK",
  });
};

export default SuccessAlert;

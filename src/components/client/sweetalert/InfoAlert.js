import Swal from "sweetalert2";

const InfoAlert = ({ title, text }) => {
  return Swal.fire({
    title: title || "Thông tin!",
    text: text || "Đây là một số thông tin",
    icon: "info",
    confirmButtonText: "OK",
    customClass: {
      container: 'swal2-container-custom',
    }
  });
};

export default InfoAlert;

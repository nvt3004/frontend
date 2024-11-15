import Swal from "sweetalert2";

const InfoAlert = ({ title, text }) => {
  return Swal.fire({
    title: title || "Information!",
    text: text || "Here is some information.",
    icon: "info",
    confirmButtonText: "OK",
    customClass: {
      container: 'swal2-container-custom',
    }
  });
};

export default InfoAlert;

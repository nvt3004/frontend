import Swal from "sweetalert2";

const InfoAlert = ({ title, text }) => {
  return Swal.fire({
    title: title || "Information!",
    text: text || "Here is some information.",
    icon: "info",
    confirmButtonText: "OK",
  });
};

export default InfoAlert;

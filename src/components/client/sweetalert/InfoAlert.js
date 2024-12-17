import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InfoAlert = ({ title, text }) => {
  toast.info(text || "Đây là một số thông tin", {
    position: "top-right",
    autoClose: 3000,
    closeOnClick: true,
    pauseOnHover: true,
  });
  return null;
};

export default InfoAlert;

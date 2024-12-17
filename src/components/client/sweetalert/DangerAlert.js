import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DangerAlert = ({ title, text }) => {
  toast.error(text || "Xảy ra lỗi!", {
    position: "top-right",
    autoClose: 3000,
    closeOnClick: true,
    pauseOnHover: true,
  });
  return null;
};

export default DangerAlert;

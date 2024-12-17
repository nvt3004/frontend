import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WarningAlert = ({ title, text }) => {
  toast.warn(text || "Hãy cẩn thận!", {
    position: "top-right",
    autoClose: 3000,
    closeOnClick: true,
    pauseOnHover: true,
  });
  return null;
};

export default WarningAlert;

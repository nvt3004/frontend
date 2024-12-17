import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SuccessAlert = ({ title, text }) => {
  
  toast.success(text || "Thao tác thành công!", {
    position: "top-right",
    autoClose: 3000,       
    closeOnClick: true,    
    pauseOnHover: true,  
  });
  return null;
};

export default SuccessAlert;
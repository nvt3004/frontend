import axios from "axios";
import Cookies from "js-cookie";

// Tạo một instance của Axios với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // URL gốc của API
  timeout: 10000, // Thời gian chờ tối đa là 10 giây
  headers: {
    "Content-Type": "application/json",
  },
});

// Cấu hình interceptors để xử lý yêu cầu và phản hồi
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token từ cookie
    const token = Cookies.get("access_token");
    if (token) {
      // Đính token vào header Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
   if(response && response.data){
    return response;
   }
   return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

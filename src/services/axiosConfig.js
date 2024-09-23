import axios from "axios";
import Cookies from "js-cookie";

// Tạo một instance của Axios với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", // URL gốc của API
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
    // Xử lý lỗi yêu cầu (request)
    console.error("Error in request:", error);
    return Promise.reject(error); // Tiếp tục trả về lỗi
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Kiểm tra xem response có dữ liệu không, nếu có thì trả về
    if (response && response.data) {
      return response.data; // Trả về dữ liệu trực tiếp
    }
    return response; // Nếu không có dữ liệu, trả về toàn bộ response
  },
  (error) => {
    // Xử lý lỗi phản hồi (response)
    console.error("Error in response:", error);  
    // Bạn có thể kiểm tra các mã trạng thái lỗi để thực hiện hành động cụ thể
    if (error.response) {
      // Lỗi từ phía server (status code khác 2xx)
      if (error.response.status === 401) {
        // Ví dụ: Xử lý khi user chưa đăng nhập hoặc token hết hạn
        console.warn("Unauthorized - redirecting to login");
        // Redirect to login page
        window.location.href = "/auth/login";
      } else if (error.response.status === 500) {
        // Xử lý lỗi server
        console.error("Server error");
      }
    } else if (error.request) {
      // Lỗi xảy ra khi không nhận được phản hồi từ server
      console.error("No response from server:", error.request);
    } else {
      // Các lỗi khác
      console.error("Error in setting up request:", error.message);
    }
    return Promise.reject(error); // Trả về lỗi để tiếp tục xử lý ở nơi gọi API
  }
);

export default axiosInstance;

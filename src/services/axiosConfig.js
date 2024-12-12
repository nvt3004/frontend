import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: "https://api.stepstothefuture.store/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

const refreshAxiosInstance = axios.create({
  baseURL: "https://api.stepstothefuture.store/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Error in request:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.data &&
      error.response.data.errorCode === 999
    ) {
      console.error("Access token has expired, refreshing token.");

      try {
        const refreshToken = Cookies.get("refreshToken");
        console.log("RefreshToken is: " + refreshToken);

        const response = await refreshAxiosInstance.post("/auth/refresh", { token: refreshToken });

        if (response.status === 200) {
          console.log("Token refreshed successfully:", response.data);
          const thirtyMinutesInDays = 30 / (24 * 60);

          Cookies.set("token", response.data.token, {
            expires: thirtyMinutesInDays,
          });

          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

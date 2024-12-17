import axiosInstance from "../axiosConfig";
import SuccessAlert from "../../components/client/sweetalert/SuccessAlert";
import DangerAlert from "../../components/client/sweetalert/DangerAlert";
import WarningAlert from "../../components/client/sweetalert/WarningAlert";
import InfoAlert from "../../components/client/sweetalert/InfoAlert";
import ConfirmAlert from "../../components/client/sweetalert/ConfirmAlert";
import { Navigate } from "react-router-dom";
import { stfExecAPI } from "../../stf/common";
import {
  incrementWishlist,
  decrementWishlist,
} from "../../store/actions/wishlistActions";
const search = async ({
  query,
  categoryID,
  minPrice,
  maxPrice,
  attributes, // Danh sách attribute IDs
  sortMaxPrice,
  page,
  pageSize,
} = {}) => {
  try {
    // Chuyển attributes thành chuỗi ID phân tách bởi dấu phẩy
    const attribute = attributes ? attributes.join(",") : null;

    const { data } = await axiosInstance.get("product/search", {
      params: {
        query,
        categoryID,
        minPrice,
        maxPrice,
        attribute, // Sử dụng chuỗi attribute ID đã được định dạng
        sortMaxPrice,
        page,
        pageSize,
      },
    });
    return data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          console.log(
            "Bad Request: ",
            data?.message || "Invalid query parameters."
          );
          break;
        case 500:
          console.log(
            "Error: ",
            data?.message || "An error occurred during product search."
          );
          break;
        case 204:
          console.log("No Content: No products found.");
          break;
        default:
          console.log("Unknown Error: An unexpected error occurred.");
          break;
      }
    } else {
      console.log(
        "Connection Error: Failed to connect to the server. Error message:",
        error.message
      );
    }
  }
};

const getFilterAttribute = async () => {
  try {
    const response = await axiosInstance.get("/product/FilterAttribute");
    return response;
  } catch (error) {
    console.error("Error fetching FilterAttribute:", error);
    if (error.response && error.response.status === 404) {
      console.warn("No FilterAttribute found");
    } else {
      console.error("An unexpected error occurred");
    }
  }
};

const getTopProducts = async () => {
  try {
    const response = await axiosInstance.get("/product/getTopProducts");
    return response;
  } catch (error) {
    console.error("Error fetching Products:", error);
    if (error.response && error.response.status === 404) {
      console.warn("No Products found");
    } else {
      console.error("An unexpected error occurred");
    }
  }
};

const getRecommendedProducts = async () => {
  try {
    const response = await axiosInstance.get("/product/getRecommendedProducts");
    return response;
  } catch (error) {
    console.error("Error fetching Products:", error);
    if (error.response && error.response.status === 404) {
      console.warn("No Products found");
    } else {
      console.error("An unexpected error occurred");
    }
  }
};
const getProductDetail = async (id) => {
  try {
    const response = await axiosInstance.get(`/home/product/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching Products:", error);
    if (error.response && error.response.status === 404) {
      console.warn("No Products found");
    } else {
      console.error("An unexpected error occurred");
    }
  }
};

const addWishlist = async (productId, dispatch) => {
  try {
    // Tạo đối tượng wishlistModel với productId

    const [error, data] = await stfExecAPI({
      method: "post",
      url: `api/user/wishlist/add`,
      data: {
        productId: productId,
      },
    });

    // Hiển thị thông báo thành công
    if (!error) {
      dispatch(incrementWishlist());
      SuccessAlert({
        title: "Thành công!",
        text: "Thêm sản phẩm vào mục yêu thích thành công.",
      });
    } else {
      window.location.href = "/auth/login";
    }

    return data;
  } catch (error) {
    // Kiểm tra các mã trạng thái khác nhau để xử lý lỗi cụ thể

    DangerAlert({
      title: "Lỗi",
      text: "Xảy ra lỗi trong quá trình xử lý.",
    });
  }
};
const removeWishlist = async (productId, dispatch) => {
  try {
    const [error, data] = await stfExecAPI({
      method: "delete",
      url: `api/user/wishlist/remove/${productId}`,
    });

    if (!error) {
      dispatch(decrementWishlist());
      SuccessAlert({
        title: "Thành công!",
        text: "Xóa sản phẩm khỏi mục yêu thích thành công.",
      });
    } else {
      window.location.href = "/auth/login";
    }

    return data;
  } catch (error) {
    DangerAlert({
      title: "Lỗi",
      text: "Xảy ra lỗi trong quá trình xử lý.",
    });
  }
};

const getProductWish = async () => {
  try {
    const [error, data] = await stfExecAPI({
      method: "get",
      url: "api/user/wishlist/getproductwish",
    });

    // Nếu thành công, trả về dữ liệu từ server
    return data.data;
  } catch (error) {
    // Kiểm tra lỗi và ghi log phù hợp
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          console.log(
            "Bad Request: ",
            data.message || "Authorization header or token is missing."
          );
          break;
        case 401:
          console.log(
            "Unauthorized: ",
            data.message || "Token is missing, empty, or expired."
          );
          break;
        case 403:
          console.log("Forbidden: ", data.message || "Account is locked.");
          break;
        case 404:
          console.log("Not Found: ", data.message || "User not found.");
          break;
        case 204:
          console.log("No Content: No products found in wishlist.");
          break;
        default:
          console.log("Unknown Error: An unexpected error occurred.");
          break;
      }
    } else {
      console.log("Connection Error: Failed to connect to the server.");
    }
  }
};

const getCartAll = async () => {
  try {
    const [error, data] = await stfExecAPI({
      url: "api/user/cart/all",
    });
    return data?.data;
  } catch (err) {
    console.error("Unexpected error:", err);
  }
};

const getOrder = async (keyword, statusId, size, page) => {
  try {
    const { data } = await axiosInstance.get("user/orders/username", {
      params: {
        keyword: keyword,
        statusId: statusId,
        size: size,
        page: page,
      },
    });
    return data.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          console.log(
            "Bad Request: ",
            data.message || "Authorization header or token is missing."
          );
          break;
        case 401:
          console.log(
            "Unauthorized: ",
            data.message || "Token is missing, empty, or expired."
          );
          break;
        case 403:
          console.log("Forbidden: ", data.message || "Account is locked.");
          break;
        case 404:
          console.log("Not Found: ", data.message || "User not found.");
          break;
        case 204:
          console.log("No Content: No orders found for the user.");
          break;
        case 500:
          console.log(
            "Error: ",
            data?.message || "An error occurred during fetching feedback."
          );
          break;
        default:
          console.log("Unknown Error: An unexpected error occurred.");
          break;
      }
    } else {
      console.log("Connection Error: Failed to connect to the server.");
    }
  }
};
const getOrderStatus = async (size, page) => {
  try {
    const data = await axiosInstance.get("/user/orders/statuses");
    return data.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          console.log(
            "Bad Request: ",
            data.message || "Authorization header or token is missing."
          );
          break;
        case 401:
          console.log(
            "Unauthorized: ",
            data.message || "Token is missing, empty, or expired."
          );
          break;
        case 403:
          console.log("Forbidden: ", data.message || "Account is locked.");
          break;
        case 404:
          console.log("Not Found: ", data.message || "User not found.");
          break;
        case 204:
          console.log("No Content: No orders found for the user.");
          break;
        case 500:
          console.log(
            "Error: ",
            data?.message || "An error occurred during fetching feedback."
          );
          break;
        default:
          console.log("Unknown Error: An unexpected error occurred.");
          break;
      }
    } else {
      console.log("Connection Error: Failed to connect to the server.");
    }
  }
};
const getFeedback = async ({ idProduct, page }) => {
  try {
    const { data } = await axiosInstance.get("user/feedback", {
      params: {
        idProduct,
        page,
      },
    });
    return data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          console.log("Bad Request: ", data?.message || "Invalid product ID.");
          break;
        case 404:
          console.log("Not Found: ", data?.message || "Product not found.");
          break;
        case 204:
          console.log("No Content: No feedback found for this product.");
          break;
        case 500:
          console.log(
            "Error: ",
            data?.message || "An error occurred during fetching feedback."
          );
          break;
        default:
          console.log("Unknown Error: An unexpected error occurred.");
          break;
      }
    } else {
      console.log(
        "Connection Error: Failed to connect to the server. Error message:",
        error.message
      );
    }
  }
};

const addFeedback = async ({
  idProd,
  idOrderDetail,
  comment,
  photos,
  rating,
}) => {
  try {
    // Kiểm tra tham số trước khi gửi
    if (!idProd || !idOrderDetail || !comment) {
      throw new Error(
        "Missing required fields. Please provide all the necessary data."
      );
    }

    const formData = new FormData();
    formData.append("comment", comment);
    formData.append("idOrderDetail", idOrderDetail);
    formData.append("productId", idProd);
    if (rating !== undefined) {
      formData.append("rating", rating);
    }
    if (photos && photos.length > 0) {
      photos.forEach((photo) => formData.append("photos", photo));
    }

    // Gửi request
    await axiosInstance.post("user/feedback/add", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Thông báo thành công
    SuccessAlert({
      title: "Thành công!",
      text: "Đánh giá của bạn đã được gửi đi.",
    });
  } catch (error) {
    DangerAlert({
      title: "Lỗi",
      text: "Xảy ra lỗi trong quá trình xử lý.",
    });
  }
};

const cancelOrder = async (idOrder) => {
  try {
    // Hiển thị xác nhận từ người dùng
    const check = await ConfirmAlert({
      title: "Xác nhận hủy đơn hàng",
      text: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
      confirmText: "Xác nhận",
      cancelText: "Hủy",
    });

    if (check) {
      // Gửi yêu cầu hủy đơn hàng
      await axiosInstance.put(`/user/orders/cancel-order`, null, {
        params: { orderId: idOrder },
      });

      // Thông báo thành công
      SuccessAlert({
        title: "Hủy đơn thành công!",
        text: "Đơn hàng của bạn đã được hủy.",
      });
    }
  } catch (error) {
    DangerAlert({
      title: "Lỗi",
      text: "Xảy ra lỗi trong quá trình xử lý.",
    });
  }
};

const searchProductByImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const { data } = await axiosInstance.post(
      "product/searchByImage",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
};

const speechToText = async (audioWavFile) => {
  try {
    const formData = new FormData();
    formData.append("file", audioWavFile);

    const { data } = await axiosInstance.post(
      "product/transcription",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
};
const confirmReceived = async (idOrder) => {
  try {
    const check = await ConfirmAlert({
      title: "Xác nhận",
      text: "Xác nhận bạn đã nhận được hàng",
      confirmText: "Xác nhận",
      cancelText: "Hủy",
    });
  if(check){
    await axiosInstance.put(`/user/orders/confirm-received`, null, {
      params: { orderId: idOrder },
    });    

    SuccessAlert({
      title: "Thành công!",
      text: "Xác nhận đơn hàng thành công.",
    });
  }
  } catch (error) {
    DangerAlert({
      title: "Lỗi",
      text: "Xảy ra lỗi trong quá trình xử lý.",
    });
  }
};
const productApi = {
  getProds: search,
  getFilterAttribute,
  getTopProducts,
  getProductDetail,
  addWishlist,
  removeWishlist,
  getProductWish,
  getCartAll,
  getOrder,
  getFeedback,
  getRecommendedProducts,
  getOrderStatus,
  addFeedback,
  cancelOrder,
  searchProductByImage,
  speechToText,
  confirmReceived
};
export default productApi;

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
        title: "Product Added!",
        text: "The product has been successfully added to your wishlist.",
      });
    } else {
      window.location.href = "/auth/login";
    }

    return data;
  } catch (error) {
    // Kiểm tra các mã trạng thái khác nhau để xử lý lỗi cụ thể

    if (error.response) {
      const { status, data } = error.response;
      console.log("abc", error);
      switch (status) {
        case 400:
          DangerAlert({ title: "Invalid Token", text: data.message });
          break;
        case 401:
          WarningAlert({ title: "Token Expired", text: data.message });
          break;
        case 403:
          WarningAlert({ title: "Account Locked", text: data.message });
          break;
        case 404:
          DangerAlert({ title: "Not Found", text: data.message });
          break;
        case 409:
          InfoAlert({ title: "Already Liked", text: data.message });
          break;
        case 422:
          DangerAlert({ title: "Invalid Input", text: data.message });
          break;
        default:
          DangerAlert({
            title: "Unknown Error",
            text: "An unexpected error occurred",
          });
          break;
      }
    } else {
      DangerAlert({
        title: "Connection Error",
        text: "Failed to connect to the server",
      });
    }
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
        title: "Deleted!",
        text: "The wishlist item has been successfully removed.",
      });
    } else {
      window.location.href = "/auth/login";
    }

    return data;
  } catch (error) {
    console.error("Error while removing wishlist item:", error);

    // Kiểm tra lỗi với `error.response`
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          DangerAlert({ title: "Invalid Token", text: data.message });
          break;
        case 401:
          WarningAlert({ title: "Token Expired", text: data.message });
          break;
        case 403:
          WarningAlert({ title: "Account Locked", text: data.message });
          break;
        case 404:
          DangerAlert({ title: "Not Found", text: data.message });
          break;
        default:
          DangerAlert({
            title: "Unknown Error",
            text: "An unexpected error occurred.",
          });
          break;
      }
    } else {
      DangerAlert({
        title: "Connection Error",
        text: "Failed to connect to the server.",
      });
    }
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
    const data = await axiosInstance.get("/staff/orders/statuses");
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
      title: "Success!",
      text: "Your feedback has been successfully submitted.",
    });
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      // Xử lý các lỗi dựa trên mã trạng thái và thông báo API trả về
      switch (status) {
        case 400:
          DangerAlert({
            title: "Invalid Input",
            text:
              data?.message ||
              "Invalid input or file format. Please check your data.",
          });
          break;
        case 401:
          DangerAlert({
            title: "Unauthorized",
            text: data?.message || "You need to log in to submit feedback.",
          });
          break;
        case 403:
          DangerAlert({
            title: "Forbidden",
            text:
              data?.message ||
              "Your account is restricted or action is forbidden.",
          });
          break;
        case 404:
          DangerAlert({
            title: "Not Found",
            text: data?.message || "Product or order not found.",
          });
          break;
        case 422:
          DangerAlert({
            title: "Invalid Data",
            text:
              data?.message ||
              "Unable to process your feedback due to invalid data.",
          });
          break;
        case 500:
          DangerAlert({
            title: "Server Error",
            text:
              data?.message ||
              "An unexpected server error occurred. Please try again later.",
          });
          break;
        default:
          DangerAlert({
            title: "Error",
            text:
              data?.message ||
              "An unknown error occurred. Please contact support.",
          });
          break;
      }
    } else {
      // Lỗi kết nối hoặc lỗi không có phản hồi từ server
      DangerAlert({
        title: "Connection Error",
        text: `Failed to connect to the server. Error: ${error.message}`,
      });
    }
  }
};

const cancelOrder = async (idOrder) => {
  try {
    // Hiển thị xác nhận từ người dùng
    const check = await ConfirmAlert({
      title: "Xác nhận hủy đơn hàng",
      text: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
      confirmText: "Xác nhận",
      cancelText: "Hủy bỏ",
    });

    if (check) {
      // Gửi yêu cầu hủy đơn hàng
      await axiosInstance.put(`/user/orders/cancel-order`, null, {
        params: { orderId: idOrder },
      });

      // Thông báo thành công
      SuccessAlert({
        title: "Thành công!",
        text: "Đơn hàng của bạn đã được hủy.",
      });
    }
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      // Xử lý các lỗi dựa trên mã trạng thái và thông báo API trả về
      switch (status) {
        case 400:
          DangerAlert({
            title: "Lỗi dữ liệu",
            text:
              data?.message || "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
          });
          break;
        case 401:
          DangerAlert({
            title: "Chưa xác thực",
            text:
              data?.message || "Bạn cần đăng nhập để thực hiện thao tác này.",
          });
          break;
        case 403:
          DangerAlert({
            title: "Không có quyền",
            text: data?.message || "Bạn không có quyền hủy đơn hàng này.",
          });
          break;
        case 404:
          DangerAlert({
            title: "Không tìm thấy",
            text: data?.message || "Đơn hàng không tồn tại hoặc đã bị xóa.",
          });
          break;
        case 500:
          DangerAlert({
            title: "Lỗi hệ thống",
            text:
              data?.message ||
              "Có lỗi xảy ra trên hệ thống. Vui lòng thử lại sau.",
          });
          break;
        default:
          DangerAlert({
            title: "Lỗi",
            text:
              data?.message ||
              "Đã xảy ra lỗi không xác định. Vui lòng liên hệ hỗ trợ.",
          });
          break;
      }
    } else {
      // Lỗi kết nối hoặc lỗi không có phản hồi từ server
      DangerAlert({
        title: "Lỗi kết nối",
        text: `Không thể kết nối đến máy chủ. Chi tiết lỗi: ${error.message}`,
      });
    }
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
};
export default productApi;

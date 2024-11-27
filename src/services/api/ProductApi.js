import axiosInstance from "../axiosConfig";
import SuccessAlert from "../../components/client/sweetalert/SuccessAlert";
import DangerAlert from "../../components/client/sweetalert/DangerAlert";
import WarningAlert from "../../components/client/sweetalert/WarningAlert";
import InfoAlert from "../../components/client/sweetalert/InfoAlert";
import { Navigate } from 'react-router-dom';
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
    const attribute = attributes ? attributes.join(',') : null;

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

const getRecommendedProducts  = async () => {
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
    }else{
      window.location.href = '/auth/login';
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
    }else{
      window.location.href = '/auth/login';
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
        keyword:keyword,
        statusId:statusId,
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
            console.log("Error: ", data?.message || "An error occurred during fetching feedback.");
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
            console.log("Error: ", data?.message || "An error occurred during fetching feedback.");
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
const getFeedback = async ({ idProduct, page}) => {
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
          console.log("Error: ", data?.message || "An error occurred during fetching feedback.");
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


const addFeedback = async ({ idProduct, comment, photos, rating }) => {
  try {
    const formData = new FormData();
    formData.append("comment", comment);
    formData.append("productId", idProduct);
    if (rating !== undefined) {
      formData.append("rating", rating);
    }
    if (photos && photos.length > 0) {
      photos.forEach((photo) => formData.append("photos", photo));
    }

    await axiosInstance.post("api/user/feedback/add", formData);

    SuccessAlert({
      title: "Deleted!",
      text: "The wishlist item has been successfully removed.",
    });
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          console.log("Bad Request: ", data?.message || "Invalid input or file format.");
          break;
        case 401:
          console.log("Unauthorized: ", data?.message || "User is not authorized or token expired.");
          break;
        case 403:
          console.log("Forbidden: ", data?.message || "User account is locked.");
          break;
        case 404:
          console.log("Not Found: ", data?.message || "Product or user not found.");
          break;
        case 422:
          console.log("Unprocessable Entity: ", data?.message || "Invalid input data.");
          break;
        case 500:
          console.log("Server Error: ", data?.message || "An error occurred on the server.");
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
  addFeedback
};
export default productApi;

import axiosInstance from "../axiosConfig";
import SuccessAlert from "../../components/client/sweetalert/SuccessAlert";
import DangerAlert from "../../components/client/sweetalert/DangerAlert";
import WarningAlert from "../../components/client/sweetalert/WarningAlert";
import InfoAlert from "../../components/client/sweetalert/InfoAlert";
import { stfExecAPI } from "../../stf/common";
import {
  incrementWishlist,
  decrementWishlist
} from '../../store/actions/wishlistActions';
import { useDispatch } from 'react-redux';

const searchProduct = async (query, page) => {
  try {
    const response = await axiosInstance.get("/product/search", {
      params: {
        query,
        page,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    if (error.response && error.response.status === 404) {
      console.warn("No products found for this query");
    } else {
      console.error("An unexpected error occurred");
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

const filter = async (
  categoryName,
  minPrice,
  maxPrice,
  color,
  size,
  sortPrice,
  page
) => {
  try {
    const response = await axiosInstance.get("/product/filtered", {
      params: {
        categoryName,
        minPrice,
        maxPrice,
        color,
        size,
        sortPrice,
        page,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    if (error.response && error.response.status === 404) {
      console.warn("No products found");
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
    dispatch(incrementWishlist());
    SuccessAlert({
      title: "Product Added!",
      text: "The product has been successfully added to your wishlist.",
    });
    return data;
  } catch (error) {
    // Kiểm tra các mã trạng thái khác nhau để xử lý lỗi cụ thể

    if (error.response) {
      const { status, data } = error.response;
console.log("abc",error)
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
          DangerAlert({ title: "Unknown Error", text: "An unexpected error occurred" });
          break;
      }
    } else {
      DangerAlert({ title: "Connection Error", text: "Failed to connect to the server" });
    }
  }
};


const removeWishlist = async (productId, dispatch) => {
  try {
    const [error, data] = await stfExecAPI({
      method: "delete",
      url: `api/user/wishlist/remove/${productId}`,
    });
    // Nếu thành công, hiển thị SuccessAlert
    dispatch(decrementWishlist());
    SuccessAlert({ title: "Deleted!", text: "The wishlist item has been successfully removed." });
    return data; // Trả về dữ liệu từ server
  } catch (error) {
    // Kiểm tra lỗi và hiển thị thông báo phù hợp với các alert component
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
          DangerAlert({ title: "Unknown Error", text: "An unexpected error occurred." });
          break;
      }
    } else {
      DangerAlert({ title: "Connection Error", text: "Failed to connect to the server." });
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
          console.log("Bad Request: ", data.message || "Authorization header or token is missing.");
          break;
        case 401:
          console.log("Unauthorized: ", data.message || "Token is missing, empty, or expired.");
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
    return data.data;
  } catch (err) {
    console.error("Unexpected error:", err);
  }
};



const getOrder = async (size = 10, page = 0) => {
  try {
    const [error, data] = await stfExecAPI({
      method: "get",
      url: "api/staff/orders/username",
      params: {
        size: size,
        page: page
      },
    });

    return data.data;
  } catch (error) {
 
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          console.log("Bad Request: ", data.message || "Authorization header or token is missing.");
          break;
        case 401:
          console.log("Unauthorized: ", data.message || "Token is missing, empty, or expired.");
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
        default:
          console.log("Unknown Error: An unexpected error occurred.");
          break;
      }
    } else {
      console.log("Connection Error: Failed to connect to the server.");
    }
  }
};

const productApi = {
  searchProduct,
  getFilterAttribute,
  filter,
  getTopProducts,
  getProductDetail,
  addWishlist,
  removeWishlist,
  getProductWish,
  getCartAll,
  getOrder
};
export default productApi;

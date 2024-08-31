// src/api/ExamProdApi.js
import axiosInstance from "../axiosConfig";

// Lấy danh sách sản phẩm (GET)
export const getProducts = async () => {
  try {
    const response = await axiosInstance.get("/products");
    return response;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Lấy danh sách sản phẩm có phân trang và giới hạn (GET)
export const getProductLimit = async (params) => {
  try {
    const response = await axiosInstance.get("/products", { params });
    return response;
  } catch (error) {
    console.error("Error fetching products with pagination:", error);
    throw error;
  }
};

// Lấy chi tiết sản phẩm theo ID (GET)
export const getProductById = async (productId) => {
  try {
    const response = await axiosInstance.get(`/products/${productId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    throw error;
  }
};

// Thêm sản phẩm mới (POST)
export const createProduct = async (productData) => {
  try {
    const response = await axiosInstance.post("/products", productData);
    return response;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Cập nhật sản phẩm theo ID (PUT)
export const updateProduct = async (productId, productData) => {
  try {
    const response = await axiosInstance.put(
      `/products/${productId}`,
      productData
    );
    return response;
  } catch (error) {
    console.error(`Error updating product with ID ${productId}:`, error);
    throw error;
  }
};

// Xóa sản phẩm theo ID (DELETE)
export const deleteProduct = async (productId) => {
  try {
    const response = await axiosInstance.delete(`/products/${productId}`);
    return response;
  } catch (error) {
    console.error(`Error deleting product with ID ${productId}:`, error);
    throw error;
  }
};

// // Reset mật khẩu (POST)
// export const resetPassword = async (token, newPassword) => {
//   try {
//     const response = await axiosInstance.post("/reset-password", { token, newPassword });
//     // response.status(200)
//     console.log("Status code:", response)
//     return response;
//   } catch (error) {
//     console.error("Error resetting password:", error);
//     throw error;
//   }
// };

// Tạo người dùng mới (POST)
export const loginSocial = async (userData) => {
  try {
    const response = await axiosInstance.post("/login-social", userData);
    console.log("User login socail successfully:", response.data);
    return response;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Đăng nhập bằng Username và Password (POST)
export const loginWithEmail = async (username, password) => {
  try {
    const response = await axiosInstance.post("/login", { username, password });

    if (response.status === 200) {
      console.log("User login successfully:", response.data);
      return response;
    } else {
      console.error(
        "Login failed with status:",
        response.status,
        response.data
      );
      throw new Error(response.data.error || "Login failed");
    }
  } catch (error) {
    console.error("User login failed:", error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/register", userData);
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

// Gửi yêu cầu đặt lại mật khẩu
export const sendResetPasswordEmail = async (email) => {
  try {
    const response = await axiosInstance.post("/send", { to: email });

    // Kiểm tra nếu mã trạng thái là 200 (OK)
    if (response.status === 200) {
      console.log("Reset password email sent successfully:", response.data);
      return response.data;
    } else {
      // Xử lý khi mã trạng thái khác 200 (thất bại)
      console.error(
        "Failed to send reset password email:",
        response.status,
        response.data
      );
      throw new Error(
        response.data.error || "Failed to send reset password email"
      );
    }
  } catch (error) {
    console.error("Failed to send reset password email:", error);
    throw error;
  }
};

// Đặt lại mật khẩu (POST)
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axiosInstance.post("/api/reset-password", {
      token,
      newPassword,
    });

    if (response.status === 200) {
      console.log("Password reset successfully:", response.data);
      return response.data;
    } else {
      console.error(
        "Password reset failed with status:",
        response.status,
        response.data
      );
      throw new Error(response.data.error || "Password reset failed");
    }
  } catch (error) {
    console.error("Password reset failed:", error);
    throw error;
  }
};


// export const sendResetPasswordSMS = async (phoneNumber) => {
//   try {
//     // Kiểm tra nếu phần tử recaptcha-container đã có trên DOM
//     if (!document.getElementById('recaptcha-container')) {
//       throw new Error("recaptcha-container element not found");
//     }

//     // Khởi tạo RecaptchaVerifier
//     const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
//       size: 'invisible',
//       callback: (response) => {
//         // reCAPTCHA solved, allow send SMS
//       },
//       'expired-callback': () => {
//         // Response expired; ask user to solve reCAPTCHA again
//       }
//     }, auth);

//     // Gửi mã SMS
//     const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
//     return confirmationResult;
//   } catch (error) {
//     console.error("Error sending SMS:", error);
//     throw new Error(error.message);
//   }
// };

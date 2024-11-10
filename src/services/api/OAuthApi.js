import Cookies from 'js-cookie';
import axiosInstance from "../axiosConfig";

export const loginSocial = async (userData) => {
  try {
    const response = await axiosInstance.post("/login-social", userData);
    console.log("User login successfully:", response.data);
      const thirtyMinutesInDays = 30 / (24 * 60); // Chuyển đổi phút thành ngày
      Cookies.set('token', response.data.token, { expires: thirtyMinutesInDays });
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
      const thirtyMinutesInDays = 1; // Chuyển đổi phút thành ngày
      Cookies.set('token', response.data.token, { expires: thirtyMinutesInDays });
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

export const getProfile = async () => {
  try {
    const token = Cookies.get("token"); // Lấy token từ cookie

    if (!token) {
      throw new Error("Token không tồn tại");
    }

    const response = await axiosInstance.get("/adminuser/get-profile", {
      headers: {
        Authorization: `Bearer ${token.trim()}`, // Dùng trim() để loại bỏ khoảng trắng
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    throw error;
  }
};


// Gửi yêu cầu đặt lại mật khẩu
export const sendResetPasswordEmail = async (email) => {
  try {
    const response = await axiosInstance.post("/send", { to: email });

    if (response.status === 200) {
      console.log("Reset password email sent successfully:", response.data);
      return response.data;
    } else {
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
    const response = await axiosInstance.post("reset-password", {
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

export const updateUser = async (userId, updatedUser) => {
  try {
    const token = Cookies.get("token");

    if (!token) {
      throw new Error("Token không tồn tại");
    }

    const response = await axiosInstance.put(`/adminuser/update/${userId}`, updatedUser, { 
      headers: {
        Authorization: `Bearer ${token.trim()}`, 
      },
    });
    
    return response.data; 
  } catch (error) {
    console.error("Error updating user:", error.message); 
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

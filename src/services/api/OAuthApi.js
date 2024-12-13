import Cookies from "js-cookie";
import axiosInstance from "../axiosConfig";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../config/FirebaseConfig";
import SuccessAlert from "../../components/client/sweetalert/SuccessAlert";
import { jwtDecode } from "jwt-decode";

// export const refreshToken = async (refresh) => {
//   try {
//     // const token = Cookies.get("refreshToken");
//     // console.log("RefreshToken là: " + token);

//     const response = await axiosInstance.post("/auth/refresh", {token:refresh});

//     // console.log("Dữ liệu: " + response.data);

//     // console.log("Trạng thái: " + response.status);

//     if (response.status === 200) {
//       console.log("Token refreshed successfully:", response.data);
//       // const decodedToken = jwtDecode(response.data.token);
//       // const expTimeInSeconds = decodedToken.exp - Math.floor(Date.now() / 1000);
//       // const expTimeInDays = expTimeInSeconds / (24 * 60 * 60);
//       const thirtyMinutesInDays = 30 / (24 * 60);

//       Cookies.set("token", response.data.token, {
//         expires: thirtyMinutesInDays,
//       });
//       return response.data.token;
//     } else {
//       throw new Error("Làm mới token thất bại");
//     }
//   } catch (error) {
//     console.error("Error refreshing token:", error.message);
//     throw error;
//   }
// };

export const loginSocial = async (userData) => {
  try {
    const response = await axiosInstance.post("/login-social", userData);
    console.log("User login successfully:", response.data);
    const thirtyMinutesInDays = 30 / (24 * 60);
    Cookies.set("token", response.data.token, { expires: thirtyMinutesInDays });
    return response;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const loginWithEmail = async (username, password) => {
  try {
    const response = await axiosInstance.post("/login", { username, password });
    if (response.data.statusCode === 200) {
      console.log("User login successfully:", response.data);

      const thirtyMinutesInDays = (5 * 60) / (24 * 60);

      const decodedRefreshToken = jwtDecode(response.data.refreshToken);
      const expTimeInSecondRefreshToken =
        decodedRefreshToken.exp - Math.floor(Date.now() / 1000);
      const expTimeInDayRefreshToken =
        expTimeInSecondRefreshToken / (24 * 60 * 60);

      Cookies.set("token", response.data.token, {
        expires: thirtyMinutesInDays,
      });
      Cookies.set("refreshToken", response.data.refreshToken, {
        expires: expTimeInDayRefreshToken,
      });

      return response;
    } else {
      console.error(
        "Login failed with status:",
        response.data.statusCode,
        response.data
      );

      // Attach the response to the error object
      const error = new Error(response.data.error || "Login failed");
      error.response = response; // Attach response
      throw error;
    }
  } catch (error) {
    console.error("User login failed:", error);
    throw error; // Retain original error with response attached
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
    const token = Cookies.get("token");
    // const refresh = Cookies.get("refreshToken");
    // const newToken = await refreshToken(refresh);
    // console.log̣("Data "+newToken)
    if (!token) {
      throw new Error("Token không tồn tại");
    }

    const response = await axiosInstance.get("/adminuser/get-profile", {
      headers: {
        Authorization: `Bearer ${token.trim()}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    throw error;
  }
};

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

    const response = await axiosInstance.put(
      `/adminuser/update/${userId}`,
      updatedUser,
      {
        headers: {
          Authorization: `Bearer ${token.trim()}`,
        },
      }
    );
    SuccessAlert({
      title: "Product Added!",
      text: "The product has been successfully added to your wishlist.",
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw error;
  }
};

export const sendResetPasswordSMS = async (phoneNumber) => {
  try {
    if (!document.getElementById("recaptcha-container")) {
      throw new Error("recaptcha-container element not found");
    }

    const recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {},
        "expired-callback": () => {},
      },
      auth
    );

    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      recaptchaVerifier
    );
    return confirmationResult;
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw new Error(error.message);
  }
};

export const verifyOtp = async ({ username, otp }) => {
  const response = await axiosInstance.post("/verify-otp", { username, otp });
  return response.data;
};

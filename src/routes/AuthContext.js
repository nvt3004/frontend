import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Thêm state loading

  useEffect(() => {
    const token = Cookies.get("token");
    setIsAuthenticated(!!token);
    console.log("isAuthenticated updated to:", !!token);
    setLoading(false); // Đánh dấu rằng quá trình kiểm tra đã hoàn tất
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

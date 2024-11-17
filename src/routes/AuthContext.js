import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getProfile } from "../services/api/OAuthApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("token");
        if (token) {
          setIsAuthenticated(true);
          const profileData = await getProfile();
          setProfile(profileData);

          if (
            profileData.listData &&
            profileData.listData.authorities &&
            profileData.listData.authorities.length > 0
          ) {
            setRole(profileData.listData.authorities[0].authority);
            console.log(
              "Vai trò: " + profileData.listData.authorities[0].authority
            );
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    const intervalId = setInterval(() => {
      if (!Cookies.get("token")) {
        setIsAuthenticated(false);
      }
    }, 1000 * 10);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

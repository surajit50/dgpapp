import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("userToken");
      setToken(storedToken);
      setIsAuthenticated(!!storedToken);
    } catch (error) {
      setIsAuthenticated(false);
      setToken(null);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(["userToken", "userData"]);
      setIsAuthenticated(false);
      setToken(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    isAuthenticated,
    token,
    checkAuthStatus,
    logout,
  };
};

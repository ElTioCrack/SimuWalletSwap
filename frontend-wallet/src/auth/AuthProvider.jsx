import React, { useContext, createContext, useState, useEffect } from "react";
import {
  fetchWalletInfo,
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessTokenFromRefreshToken,
} from "../services/WalletServices.jsx";

const AuthContext = createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  getPublicKey: () => null,
  setPublicKey: () => {},
  getAccessToken: () => "",
  getRefreshToken: () => "",
});

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Nuevo estado para manejar la carga inicial

  useEffect(() => {
    checkAuth();
  }, []);

  const getPublicKey = () => {
    return localStorage.getItem("publicKey");
  };

  const setPublicKey = (publicKey) => {
    localStorage.setItem("publicKey", publicKey);
    };
    
  const removePublicKey = () => {
    localStorage.removeItem("publicKey");
  }
  

  const getAccessToken = () => accessToken;

  const getRefreshToken = () => refreshToken;

  const login = (newAccessToken, newRefreshToken) => {
    setIsLoggedIn(true);
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setAccessToken("");
    setRefreshToken("");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    removePublicKey()
  };

  const checkAuth = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken && refreshToken) {
        const isValidAccessToken = await verifyAccessToken(accessToken);

        if (!isValidAccessToken.success) {
          const newAccessToken = await generateAccessTokenFromRefreshToken(
            refreshToken
          );

          if (newAccessToken.success) {
            const refreshTokenValid = await verifyRefreshToken(refreshToken);
            if (refreshTokenValid) {
              login(newAccessToken.data.accessToken, refreshToken);
            } else {
              logout();
            }
          } else {
            logout();
          }
        } else {
          login(accessToken, refreshToken);
        }
      } else {
        logout();
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Muestra un indicador de carga mientras se verifica la autenticación
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        getPublicKey,
        setPublicKey,
        getAccessToken,
        getRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export { AuthProvider, useAuth };

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
  getWalletInfo: () => null,
  setWalletInfoAsync: () => {},
  getAccessToken: () => "",
  getRefreshToken: () => "",
});

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletInfo, setWalletInfo] = useState(null);
  const [accessToken, setAccessToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Nuevo estado para manejar la carga inicial

  useEffect(() => {
    checkAuth();
  }, []);

  const getWalletInfo = () => walletInfo;

  const setWalletInfoAsync = async (publicKey) => {
    try {
      const response = await fetchWalletInfo(publicKey);
      setWalletInfo(response.data);
      return response;
    } catch (error) {
      console.error("Error fetching wallet info:", error);
      return null;
    }
  };

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
    setWalletInfo(null);
    setAccessToken("");
    setRefreshToken("");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const checkAuth = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken && refreshToken) {
        const accessTokenExpired = await verifyAccessToken(accessToken);
        console.log(`accessTokenExpire: ${accessTokenExpired}`)
        if (accessTokenExpired) {
          const newAccessToken = await generateAccessTokenFromRefreshToken(
            refreshToken
          );
          console.log(`newAccessToken: ${newAccessToken}`)
          if (newAccessToken) {
            console.log(`newAccessToken: ${newAccessToken}`)
            const refreshTokenValid = await verifyRefreshToken(refreshToken);
            if (refreshTokenValid) {
              login(newAccessToken, refreshToken);
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
      setIsLoading(false); // Indica que la verificación ha terminado
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
        getWalletInfo,
        setWalletInfoAsync,
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

import AccessWalletService from "./authentication/AccessWalletService";
import CreateWalletService from "./authentication/CreateWalletService";
import verifyAccessToken from "./authentication/verifyAccessToken.jsx";
import verifyRefreshToken from "./authentication/verifyRefreshToken.jsx";
import generateAccessTokenFromRefreshToken from "./authentication/generateAccessTokenFromRefreshToken.jsx";

const fetchWalletInfo = async () => {
  try {
    // Simula una solicitud exitosa para obtener información de la billetera
    const walletInfo = {
      _id: 654213,
      walletName: "Main Wallet",
    };
    return walletInfo;
  } catch (error) {
    console.error("Error getting wallet info:", error);
    throw error;
  }
};

export {
  CreateWalletService,
  AccessWalletService,
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessTokenFromRefreshToken,
  fetchWalletInfo,
};

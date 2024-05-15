import BaseUrl from "../ApiConfig";
import axios from "axios";

const AccessWalletService = async (userData) => {
  try {
    const response = await axios.post(`${BaseUrl}/auth/AccessWalletService`, userData);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export default AccessWalletService;

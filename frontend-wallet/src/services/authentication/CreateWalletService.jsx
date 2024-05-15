import ApiResponse from "../../models/ApiResponse";
import BaseUrl from "../ApiConfig";
import axios from "axios";

const endpointUrl = "auth/create-wallet";

const CreateWalletService = async (walletData) => {
  try {
    const response = await axios.post(
      `${BaseUrl}/${endpointUrl}`,
      // JSON.stringify(walletData)
      walletData
    );

    const statusCode = response.status;
    const success = response.data.success;
    const message = response.data.message;
    const data = response.data.data;

    return new ApiResponse(statusCode, success, message, data);
  } catch (error) {
    console.error("Error creating wallet:", error);
    const statusCode = error.response ? error.response.status : 500;
    const errorMessage = error.response
      ? error.response.data.message
      : "Internal Server Error";
    return new ApiResponse(statusCode, false, errorMessage, null);
  }
};

export default CreateWalletService;

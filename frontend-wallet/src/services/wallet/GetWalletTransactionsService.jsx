import axios from "axios";
import ApiResponse from "./../../models/ApiResponse";
import BaseUrl from "./../ApiConfig";

const endpointUrl = "transactions";

const GetWalletTransactionsService = async (publicKey) => {
  try {
    const response = await axios.get(`${BaseUrl}/${endpointUrl}/${publicKey}`);

    const statusCode = response.status;
    const success = statusCode === 200;
    const message =
      response.data.message || "Transactions retrieved successfully.";
    const data = response.data.data;

    return new ApiResponse(statusCode, success, message, data);
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    const statusCode = error.response ? error.response.status : 500;
    const errorMessage = error.response
      ? error.response.data.message
      : "Internal Server Error";
    return new ApiResponse(statusCode, false, errorMessage, null);
  }
};

export default GetWalletTransactionsService;

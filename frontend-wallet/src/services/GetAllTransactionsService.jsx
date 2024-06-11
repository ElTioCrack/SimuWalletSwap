import axios from "axios";
import ApiResponse from "../models/ApiResponse";
import BaseUrl from "./ApiConfig";

const GetAllTransactionsService = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/all-transactions`);
    const { status, data } = response;

    return new ApiResponse(status, data.success, data.message, data.data);
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    const statusCode = error.response ? error.response.status : 500;
    const errorMessage = error.response
      ? error.response.data.message
      : "Internal Server Error";
    return new ApiResponse(statusCode, false, errorMessage, null);
  }
};

export default GetAllTransactionsService;

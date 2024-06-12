import axios from "axios";
import ApiResponse from "./../../models/ApiResponse";
import BaseUrl from "./../ApiConfig";

const endpointUrl = "/all-transactions/pending";

const GetPendingTransactionsService = async () => {
  try {
    const response = await axios.get(`${BaseUrl}${endpointUrl}`);

    const statusCode = response.status;
    const success = response.data.success;
    const message = response.data.message;
    const data = response.data.data;

    return new ApiResponse(statusCode, success, message, data);
  } catch (error) {
    console.error("Error fetching pending transactions:", error);
    const statusCode = error.response ? error.response.status : 500;
    const errorMessage = error.response
      ? error.response.data.message
      : "Internal Server Error";
    return new ApiResponse(statusCode, false, errorMessage, null);
  }
};

export default GetPendingTransactionsService;

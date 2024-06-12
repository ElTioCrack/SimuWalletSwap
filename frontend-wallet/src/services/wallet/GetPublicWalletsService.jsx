import axios from "axios";
import ApiResponse from "./../../models/ApiResponse";
import BaseUrl from "./../ApiConfig";

const endpointUrl = "wallet/public";

const GetPublicWalletsService = async () => {
  try {
    const response = await axios.get(`${BaseUrl}/${endpointUrl}`);
    const { statusCode, success, message, data } = response.data;
    return new ApiResponse(statusCode, success, message, data);
  } catch (error) {
    console.error("Error fetching public wallets:", error);
    const statusCode = error.response ? error.response.status : 500;
    const errorMessage = error.response
      ? error.response.data.message
      : "Internal Server Error";
    return new ApiResponse(statusCode, false, errorMessage, null);
  }
};

export default GetPublicWalletsService;

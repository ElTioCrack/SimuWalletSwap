import axios from "axios";
import ApiResponse from "../../models/ApiResponse";
import BaseUrl from "../ApiConfig";

const verifyRefreshToken = async (token) => {
  const endpointUrl = "auth/verify-refresh-token";
  try {
    const response = await axios.post(`${BaseUrl}/${endpointUrl}`, null, {
      headers: { Authorization: token },
    });

    const { status, data } = response;
    const { success, message, data: responseData } = data;

    return new ApiResponse(status, success, message, responseData);
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    const statusCode = error.response ? error.response.status : 500;
    const errorMessage = error.response
      ? error.response.data.message
      : "Internal Server Error";
    return new ApiResponse(statusCode, false, errorMessage, null);
  }
};

export default verifyRefreshToken;

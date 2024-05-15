import axios from "axios";
import ApiResponse from "../../models/ApiResponse";
import BaseUrl from "../ApiConfig";

const generateAccessTokenFromRefreshToken = async (refreshToken) => {
  const endpointUrl = "auth/generate-access-token";
  try {
    const response = await axios.post(`${BaseUrl}/${endpointUrl}`, null, {
      headers: { Authorization: refreshToken }
    });

    const { status, data } = response;
    const { success, message, data: responseData } = data;

    return new ApiResponse(status, success, message, responseData);
  } catch (error) {
    console.error("Error generating access token from refresh token:", error);
    const statusCode = error.response ? error.response.status : 500;
    const errorMessage = error.response
      ? error.response.data.message
      : "Internal Server Error";
    return new ApiResponse(statusCode, false, errorMessage, null);
  }
};

export default generateAccessTokenFromRefreshToken;

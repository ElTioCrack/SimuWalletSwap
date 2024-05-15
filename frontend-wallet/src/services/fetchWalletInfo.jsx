import axios from "axios";
import ApiResponse from "../models/ApiResponse";
import { useAuth } from "../auth/AuthProvider";
import BaseUrl from "../ApiConfig";

const endpointUrl = "walletInfo";

async function fetchWalletInfo(publicKey) {
    const { getAccessToken } = useAuth();

    try {
        const response = await axios.get(`${BaseUrl}/${endpointUrl}/${publicKey}`, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },
        });

        const statusCode = response.status;
        const responseData = response.data;

        return new ApiResponse(
            statusCode, 
            true,
            responseData.message,
            responseData.data
        );
    } catch (error) {
        console.error("Error en fetchWalletInfo:", error);
        const statusCode = error.response ? error.response.status : 500;
        const errorMessage = error.response ? error.response.data.message : "Internal Server Error";
        return new ApiResponse(
            statusCode,
            false,
            errorMessage,
            null
        );
    }
}

export default fetchWalletInfo;

import axios from "axios";

const GetSolanaPriceService = async () => {
  try {
    const response = await axios.get(
      "https://api.diadata.org/v1/assetQuotation/Solana/0x0000000000000000000000000000000000000000"
    );
    const price = response.data.Price;
    return price;
  } catch (error) {
    console.error("Error retrieving Solana price:", error);
    throw new Error("Unable to retrieve Solana price");
  }
};

export default GetSolanaPriceService;

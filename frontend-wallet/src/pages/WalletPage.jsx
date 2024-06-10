import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthProvider.jsx";
import NavBar from "../components/NavBar.jsx";
import QRCode from "qrcode.react";
import GetCryptoHoldingsService from "../services/GetCryptoHoldingsService.jsx";
import GetSolanaPriceService from "../services/GetSolanaPriceService.jsx";
import CreateTransactionService from "../services/CreateTransactionService.jsx"; // Importa la función creada

function WalletPage() {
  const { publicKey } = useAuth();

  const [holdings, setHoldings] = useState([]);
  const [balance, setBalance] = useState(0);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [selectedToken, setSelectedToken] = useState("");
  const [amount, setAmount] = useState("0");
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");
  const [isSendButtonEnabled, setIsSendButtonEnabled] = useState(false);

  useEffect(() => {
    if (publicKey) {
      fetchHoldingsAndPrices();
    }
  }, [publicKey]);

  useEffect(() => {
    validateSendButton();
  }, [amount, recipient]);

  const fetchHoldingsAndPrices = async () => {
    try {
      const holdingsResponse = await GetCryptoHoldingsService(publicKey);
      const solanaPrice = await GetSolanaPriceService();

      if (holdingsResponse.success && solanaPrice) {
        const holdingsData = holdingsResponse.data;
        const updatedHoldings = holdingsData.map((holding) => {
          let price = holding.token === "SOL" ? solanaPrice : holding.price;
          return {
            ...holding,
            price: price,
            value: calculateValue(price, holding.amount),
          };
        });

        setHoldings(updatedHoldings);
        setBalance(calculateBalance(updatedHoldings));
      } else {
        console.error("Error fetching holdings or price");
      }
    } catch (error) {
      console.error("Error fetching holdings and prices:", error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(publicKey);
    alert("Address copied to clipboard");
  };

  const handlePaste = () => {
    navigator.clipboard.readText().then((text) => setRecipient(text));
  };

  const truncateText = (text) => {
    const startLength = 5;
    const endLength = 4;
    const maxLength = startLength + endLength;

    if (text.length > maxLength) {
      return `${text.substring(0, startLength)}...${text.substring(
        text.length - endLength
      )}`;
    } else {
      return text;
    }
  };

  const handleReceive = () => {
    setShowReceiveModal(true);
  };

  const handleSend = (token = "") => {
    setSelectedToken(token);
    setAmount("0");
    setRecipient("");
    setError("");
    setShowSendModal(true);
  };

  const handleCloseModal = () => {
    setShowReceiveModal(false);
    setShowSendModal(false);
    setShowQrScanner(false);
  };

  const handleSendTokens = async () => {
    const selectedHolding = holdings.find((h) => h.token === selectedToken);
    if (
      parseFloat(amount) <= 0 ||
      parseFloat(amount) > parseFloat(selectedHolding.amount)
    ) {
      setError(
        `Amount must be greater than 0 and less than or equal to ${selectedHolding.amount}`
      );
      return;
    }

    try {
      const response = await CreateTransactionService({
        publicKeyOrigin: publicKey,
        publicKeyDestination: recipient,
        token: selectedToken,
        amount: parseFloat(amount),
      });

      if (response.success) {
        alert("Transaction created successfully");
        fetchHoldingsAndPrices(); // Actualiza los holdings y el balance después de la transacción
      } else {
        alert("Error creating transaction: " + response.message);
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("Error creating transaction");
    }

    handleCloseModal();
  };

  const validateSendButton = () => {
    const selectedHolding = holdings.find((h) => h.token === selectedToken);
    if (
      parseFloat(amount) > 0 &&
      parseFloat(amount) <= parseFloat(selectedHolding.amount) &&
      recipient.trim() !== ""
    ) {
      setIsSendButtonEnabled(true);
    } else {
      setIsSendButtonEnabled(false);
    }
  };

  const handleScan = (data) => {
    alert("QR code scanning functionality not implemented yet.");
    // if (data) {
    //   setRecipient(data);
    //   setShowQrScanner(false);
    // }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const calculateSolanaFee = (amount) => {
    const solanaFeeRate = 0.000005;
    return (amount * solanaFeeRate).toFixed(6);
  };

  return (
    <>
      <NavBar />
      <main className="container mx-auto px-4 py-8 min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <p className="text-gray-500">Total Wallet Value</p>
            <p className="text-2xl font-bold">${balance}</p>
          </div>
          <div className="mb-6 md:mb-0">
            <p className="text-gray-500">Main Wallet</p>
            <div className="flex items-center space-x-2">
              <p className="text-gray-700">{truncateText(publicKey)}</p>
              <button
                onClick={handleCopy}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-1 px-3 rounded-lg shadow-sm"
              >
                Copy
              </button>
              <button
                onClick={handleReceive}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-1 px-3 rounded-lg shadow-sm"
              >
                QR
              </button>
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleReceive}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg"
            >
              Receive
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg"
              onClick={() => handleSend()}
            >
              Send
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Tokens Holding</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-gray-500">Token</th>
                <th className="px-4 py-2 text-left text-gray-500">Price</th>
                <th className="px-4 py-2 text-left text-gray-500">Value</th>
                <th className="px-4 py-2 text-left text-gray-500">Amount</th>
                <th className="px-4 py-2 text-left text-gray-500"></th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{holding.token}</td>
                  <td className="px-4 py-2">${holding.price}</td>
                  <td className="px-4 py-2">${holding.value}</td>
                  <td className="px-4 py-2">{holding.amount}</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-3 rounded-lg shadow-sm"
                      onClick={() => handleSend(holding.token)}
                    >
                      Send
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal Receive */}
      {showReceiveModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-6 text-center select-none">
              Receive
            </h2>
            <div className="flex justify-center mb-6">
              <QRCode
                value={publicKey}
                size={200}
                className="shadow-md p-2 rounded-md"
              />
            </div>
            <div className="mb-4 text-center">
              <p className="text-gray-700 font-mono break-all bg-gray-100 p-2 rounded-md">
                {publicKey}
              </p>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={handleCopy}
                className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 select-none"
              >
                Copy Address
              </button>
              <button
                onClick={handleCloseModal}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 select-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Send */}
      {showSendModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Send Tokens</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Select Token</label>
              <select
                className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3"
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
              >
                {holdings.map((holding, index) => (
                  <option key={index} value={holding.token}>
                    {holding.token}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Amount (Max:{" "}
                {holdings.find((h) => h.token === selectedToken)?.amount || 0})
              </label>
              <input
                type="number"
                className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value;
                  const selectedHolding = holdings.find(
                    (h) => h.token === selectedToken
                  );
                  if (parseFloat(value) > parseFloat(selectedHolding.amount)) {
                    setAmount(selectedHolding.amount.toString());
                  } else {
                    setAmount(value);
                  }
                }}
                min="0"
              />
              <span className="ml-4 text-gray-700 text-sm">
                Fee: {calculateSolanaFee(amount)} SOL
              </span>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Recipient Address
              </label>
              <div className="flex">
                <input
                  type="text"
                  className="w-full bg-gray-100 border border-gray-300 rounded-l-lg py-2 px-3"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
                <button
                  onClick={handlePaste}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-r-lg shadow-sm"
                >
                  Paste
                </button>
                <button
                  onClick={() => setShowQrScanner(true)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 ml-2 rounded-lg shadow-sm"
                >
                  Scan
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              onClick={handleSendTokens}
              disabled={!isSendButtonEnabled}
              className={`w-full py-2 px-4 rounded-lg shadow-lg transition duration-300 ${
                isSendButtonEnabled
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Send
            </button>
            <button
              onClick={handleCloseModal}
              className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal QR Scanner */}
      {showQrScanner && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowQrScanner(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Scan QR Code</h2>
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      )}
    </>
  );
}

// Function to calculate the value of a holding
const calculateValue = (price, amount) => {
  return (parseFloat(price) * parseFloat(amount)).toFixed(2);
};

// Function to calculate the total balance
const calculateBalance = (holdings) => {
  return holdings
    .reduce((total, holding) => total + parseFloat(holding.value), 0)
    .toFixed(2);
};

export default WalletPage;

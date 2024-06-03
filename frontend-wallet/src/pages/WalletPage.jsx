import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthProvider.jsx";
import NavBar from "../components/NavBar.jsx";
import QRCode from "qrcode.react";

function WalletPage() {
  const publicKey = "72u2gtWF89LYfTNc5KQ3ZzxoxZ6kX3dH5tZcXAWe2pjq";
  const initialHoldings = [
    { name: "Bitcoin", amount: "0.5", price: "50000" },
    { name: "Ethereum", amount: "10", price: "3000" },
    { name: "Ripple", amount: "200", price: "1.5" },
  ];

  // Calculate values for each holding
  initialHoldings.forEach((holding) => {
    holding.value = calculateValue(holding.price, holding.amount);
  });

  const [holdings, setHoldings] = useState(initialHoldings);
  const [balance, setBalance] = useState(calculateBalance(initialHoldings));
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState("");
  const [amount, setAmount] = useState("0");
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");
  const [isSendButtonEnabled, setIsSendButtonEnabled] = useState(false);

  useEffect(() => {
    validateSendButton();
  }, [amount, recipient]);

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
  };

  const handleSendTokens = () => {
    const selectedHolding = holdings.find((h) => h.name === selectedToken);
    if (
      parseFloat(amount) <= 0 ||
      parseFloat(amount) > parseFloat(selectedHolding.amount)
    ) {
      setError(
        `Amount must be greater than 0 and less than or equal to ${selectedHolding.amount}`
      );
      return;
    }

    // Lógica para enviar tokens
    alert(`Sending ${amount} ${selectedToken} to ${recipient}`);
    handleCloseModal();
  };

  const validateSendButton = () => {
    const selectedHolding = holdings.find((h) => h.name === selectedToken);
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
                <th className="px-4 py-2 text-left text-gray-500">Name</th>
                <th className="px-4 py-2 text-left text-gray-500">Price</th>
                <th className="px-4 py-2 text-left text-gray-500">Value</th>
                <th className="px-4 py-2 text-left text-gray-500">Amount</th>
                <th className="px-4 py-2 text-left text-gray-500"></th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{holding.name}</td>
                  <td className="px-4 py-2">${holding.price}</td>
                  <td className="px-4 py-2">${holding.value}</td>
                  <td className="px-4 py-2">{holding.amount}</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-3 rounded-lg shadow-sm"
                      onClick={() => handleSend(holding.name)}
                    >
                      Trade
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
            <p className="mb-4 text-gray-700 text-center font-mono">
              {publicKey}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleCopy}
                className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-300 select-none"
              >
                Copy Address
              </button>
            </div>
            <div className="flex justify-center mt-6">
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
                  <option key={index} value={holding.name}>
                    {holding.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Amount (Max:{" "}
                {holdings.find((h) => h.name === selectedToken)?.amount || 0})
              </label>
              <input
                type="number"
                className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value;
                  const selectedHolding = holdings.find(
                    (h) => h.name === selectedToken
                  );
                  if (parseFloat(value) > parseFloat(selectedHolding.amount)) {
                    setAmount(selectedHolding.amount.toString());
                  } else {
                    setAmount(value);
                  }
                }}
                min="0"
              />
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

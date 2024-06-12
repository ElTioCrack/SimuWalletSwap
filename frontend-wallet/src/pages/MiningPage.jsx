import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import GetPendingTransactionsService from "../services/AllTransactions/GetPendingTransactionsService.jsx";
import UpdatePendingTransactionService from "../services/AllTransactions/UpdatePendingTransactionService.jsx";
import { useAuth } from "../auth/AuthProvider";

const MINING_PROBABILITY = 0.1; // Probabilidad de minado configurada (50%)
const MINING_SOUND_URL = "/mining-complete.mp3"; // Ruta del archivo de sonido
const MINING_COMPLETE_GIF = "/mining-complete.gif"; // Ruta del GIF de minado completo
const MINING_GIF = "/minero.gif"; // Ruta del GIF de minado

function MiningPage() {
  const { publicKey } = useAuth();
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [mining, setMining] = useState(false);
  const [miningMessage, setMiningMessage] = useState("");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const fetchPendingTransactions = async () => {
      const response = await GetPendingTransactionsService();
      if (response.success) {
        setPendingTransactions(
          response.data.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          )
        );
      } else {
        console.error(
          "Error fetching pending transactions: " + response.message
        );
      }
    };

    fetchPendingTransactions();
  }, []);

  const handleSelectTransaction = (transaction) => {
    if (!mining) {
      setSelectedTransaction(transaction);
      setAttempts(0); // Reiniciar los intentos al seleccionar una nueva transacción
    }
  };

  const playSound = () => {
    const audio = new Audio(MINING_SOUND_URL);
    audio.play();
  };

  const handleMine = async () => {
    setMining(true);
    setMiningMessage("Mining...");
    setAttempts(0);

    const minerWallet = publicKey;
    const transactionId = selectedTransaction._id;

    while (true) {
      setAttempts((prevAttempts) => {
        console.log(`Intento ${prevAttempts + 1}`);
        return prevAttempts + 1;
      });

      const waitTime = Math.floor(Math.random() * 2000) + 1000; // Entre 1 y 3 segundos
      await new Promise((resolve) => setTimeout(resolve, waitTime));

      if (Math.random() <= MINING_PROBABILITY) {
        const response = await UpdatePendingTransactionService(
          transactionId,
          minerWallet
        );
        if (response.success) {
          setMiningMessage("Transaction mined successfully!");
          setMining(false);
          playSound();
          break;
        } else {
          setMiningMessage("Error mining transaction. Retrying...");
          setMining(false);
          break;
        }
        break;
      }
    }
  };

  const handleCancelMining = () => {
    setMining(false);
    setMiningMessage("");
  };

  return (
    <>
      <NavBar />
      <main className="container mx-auto px-4 py-8 min-h-screen flex">
        <div className="w-1/3 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Pending Transactions</h2>
          <div className="grid grid-cols-1 gap-4">
            {pendingTransactions.map((transaction) => (
              <div
                key={transaction._id}
                className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-100 ${
                  mining ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => handleSelectTransaction(transaction)}
                style={{ pointerEvents: mining ? "none" : "auto" }}
              >
                <p>{new Date(transaction.timestamp).toLocaleString()}</p>
                <p>
                  Commission: {transaction.commission} {transaction.token}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-2/3 bg-white rounded-lg shadow-md p-6 ml-4">
          {selectedTransaction ? (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Transaction Details
              </h2>
              <p>
                <strong>From:</strong> {selectedTransaction.from}
              </p>
              <p>
                <strong>To:</strong> {selectedTransaction.to}
              </p>
              <p>
                <strong>Amount:</strong> {selectedTransaction.amount}{" "}
                {selectedTransaction.token}
              </p>
              <p>
                <strong>Commission:</strong> {selectedTransaction.commission}{" "}
                {selectedTransaction.token}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedTransaction.timestamp).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {new Date(selectedTransaction.timestamp).toLocaleTimeString()}
              </p>
              <p>
                <strong>Attempts:</strong> {attempts}
              </p>
              {mining ? (
                <>
                  <button
                    onClick={handleCancelMining}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-lg"
                  >
                    Cancel Mining
                  </button>
                  <div className="mt-4 flex justify-center">
                    <img src={MINING_GIF} alt="Mining..." />
                  </div>
                  <p className="mt-2 text-center">{miningMessage}</p>
                </>
              ) : (
                <button
                  onClick={handleMine}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg"
                >
                  Mine
                </button>
              )}
            </>
          ) : (
            <p>Select a transaction to view details</p>
          )}
        </div>
      </main>
      {miningMessage === "Transaction mined successfully!" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
            <img
              src={MINING_COMPLETE_GIF}
              alt="Mining Complete"
              className="mx-auto mb-4"
            />
            <p className="text-lg font-semibold">{miningMessage}</p>
            <button
              onClick={() => setMiningMessage("")}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default MiningPage;

import React, { useState } from "react";
import NavBar from "../components/NavBar";

// Enum para el tipo de transacción
const TransactionType = {
  SEND: 'send',
  RECEIVE: 'receive',
};

// Clase para las transacciones
class Transaction {
  constructor(type, token, amount, address, timestamp) {
    this.type = type;
    this.token = token;
    this.amount = amount;
    this.address = address;
    this.timestamp = timestamp;
  }
}

// Ejemplo de transacciones con direcciones inventadas
const transactions = [
  new Transaction(TransactionType.SEND, 'Bitcoin', 0.1, '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', '2024-06-01 14:32'),
  new Transaction(TransactionType.RECEIVE, 'Ethereum', 2, '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', '2024-06-01 15:45'),
  new Transaction(TransactionType.SEND, 'Ripple', 150, 'rU6K7V3Po4snVhBBaU29sesqs2qTQJWDw1', '2024-06-02 10:15'),
];

function TransactionsPage() {
  const [showFullAddress, setShowFullAddress] = useState(null);
  const [sortedTransactions, setSortedTransactions] = useState(transactions);
  const [sortOrder, setSortOrder] = useState('asc'); // asc or desc

  const toggleAddressView = (index) => {
    if (showFullAddress === index) {
      setShowFullAddress(null);
    } else {
      setShowFullAddress(index);
    }
  };

  const handleCopy = (address) => {
    navigator.clipboard.writeText(address);
    alert("Address copied to clipboard");
  };

  const sortTransactions = () => {
    const sorted = [...sortedTransactions].sort((a, b) => {
      if (sortOrder === 'asc') {
        return new Date(a.timestamp) - new Date(b.timestamp);
      } else {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }
    });
    setSortedTransactions(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <>
      <NavBar />
      <main className="container mx-auto px-4 py-8 min-h-screen">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Transaction History</h2>
            <button
              onClick={sortTransactions}
              className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg"
            >
              Sort by Date {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-gray-500">Type</th>
                <th className="px-4 py-2 text-left text-gray-500">Token</th>
                <th className="px-4 py-2 text-left text-gray-500">Amount</th>
                <th className="px-4 py-2 text-left text-gray-500">Address</th>
                <th className="px-4 py-2 text-left text-gray-500">Date</th>
                <th className="px-4 py-2 text-left text-gray-500">Time</th>
                <th className="px-4 py-2 text-left text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((transaction, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === TransactionType.SEND
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-2">{transaction.token}</td>
                  <td className="px-4 py-2">{transaction.amount}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      <span>
                        {showFullAddress === index ? transaction.address : `${transaction.address.substring(0, 6)}...${transaction.address.substring(transaction.address.length - 4)}`}
                      </span>
                      <button
                        onClick={() => toggleAddressView(index)}
                        className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                      >
                        {showFullAddress === index ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-2">{transaction.timestamp.split(' ')[0]}</td>
                  <td className="px-4 py-2">{transaction.timestamp.split(' ')[1]}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleCopy(transaction.address)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-1 px-3 rounded-lg shadow-sm"
                    >
                      Copy Address
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}

export default TransactionsPage;

import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import GetWalletTransactionsService from "../services/GetWalletTransactionsService";
import { useAuth } from "../auth/AuthProvider";

// Enum para el tipo de transacción
const TransactionType = {
  SEND: 'send',
  RECEIVE: 'receive',
  PENDING: 'pending',
  FAILED: 'failed',
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

function TransactionsPage() {
  const { publicKey } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [showFullAddress, setShowFullAddress] = useState(null);
  const [sortedTransactions, setSortedTransactions] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filter, setFilter] = useState('all'); // all, send, receive, pending, failed

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await GetWalletTransactionsService(publicKey);
      if (response.success) {
        setTransactions(response.data);
        setSortedTransactions(response.data);
      } else {
        alert("Error fetching transactions: " + response.message);
      }
    };

    fetchTransactions();
  }, [publicKey]);

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

  const handleFilterChange = (event) => {
    const filter = event.target.value;
    setFilter(filter);

    if (filter === 'all') {
      setSortedTransactions(transactions);
    } else {
      setSortedTransactions(transactions.filter(transaction => transaction.type === filter));
    }
  };

  return (
    <>
      <NavBar />
      <main className="container mx-auto px-4 py-8 min-h-screen">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Transaction History</h2>
            <div>
              <select
                onChange={handleFilterChange}
                className="bg-gray-200 border border-gray-300 rounded-lg py-2 px-3 mr-4"
                value={filter}
              >
                <option value="all">All</option>
                <option value="send">Send</option>
                <option value="receive">Receive</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <button
                onClick={sortTransactions}
                className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg"
              >
                Sort by Date {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
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
              {sortedTransactions && sortedTransactions.map((transaction, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === TransactionType.SEND
                        ? 'bg-red-100 text-red-800'
                        : transaction.type === TransactionType.RECEIVE
                        ? 'bg-green-100 text-green-800'
                        : transaction.type === TransactionType.PENDING
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
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

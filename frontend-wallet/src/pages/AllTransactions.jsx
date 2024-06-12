import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import GetAllTransactionsService from "../services/AllTransactions/GetAllTransactionsService";

function AllTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc
  const [sortedField, setSortedField] = useState("timestamp");
  const [filters, setFilters] = useState({
    token: "",
    status: "",
    minerWallet: "",
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await GetAllTransactionsService();
      if (response.success) {
        setTransactions(response.data);
      } else {
        setError(response.message);
      }
      setLoading(false);
    };
    fetchTransactions();
  }, []);

  const handleSort = (field) => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    setSortedField(field);

    const sortedTransactions = [...transactions].sort((a, b) => {
      if (field === "timestamp") {
        const dateA = new Date(a[field]);
        const dateB = new Date(b[field]);
        return newOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        return newOrder === "asc"
          ? a[field].localeCompare(b[field])
          : b[field].localeCompare(a[field]);
      }
    });

    setTransactions(sortedTransactions);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Address copied to clipboard");
  };

  const handlePaste = async (name) => {
    try {
      const text = await navigator.clipboard.readText();
      setFilters({ ...filters, [name]: text });
    } catch (error) {
      alert("Failed to read clipboard content");
    }
  };

  const handleClearFilter = (name) => {
    setFilters({ ...filters, [name]: "" });
  };

  const truncateAddress = (address) => {
    return address
      ? `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
      : "N/A";
  };

  const filteredTransactions = transactions.filter((transaction) => {
    return (
      (!filters.token || transaction.token.includes(filters.token)) &&
      (!filters.status || transaction.status === filters.status) &&
      (!filters.minerWallet ||
        transaction.minerWallet.includes(filters.minerWallet))
    );
  });

  return (
    <>
      <main className="container mx-auto px-4 py-8 min-h-screen">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">All Transactions</h2>
          {loading ? (
            <p>Loading transactions...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Filter by Token
                </label>
                <div className="flex">
                  <input
                    type="text"
                    name="token"
                    value={filters.token}
                    onChange={handleFilterChange}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3"
                    placeholder="Enter token"
                  />
                  <button
                    onClick={() => handleClearFilter("token")}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 ml-2 rounded-lg shadow-sm"
                  >
                    Clear
                  </button>
                </div>

                <label className="block text-gray-700 mb-2">
                  Filter by Status
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3 mb-4"
                >
                  <option value="">All</option>
                  <option value="complete">Complete</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>

                <label className="block text-gray-700 mb-2">
                  Filter by Miner Wallet
                </label>
                <div className="flex">
                  <input
                    type="text"
                    name="minerWallet"
                    value={filters.minerWallet}
                    onChange={handleFilterChange}
                    className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3"
                    placeholder="Enter miner wallet"
                  />
                  <button
                    onClick={() => handlePaste("minerWallet")}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 ml-2 rounded-lg shadow-sm"
                  >
                    Paste
                  </button>
                  <button
                    onClick={() => handleClearFilter("minerWallet")}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 ml-2 rounded-lg shadow-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th
                      className="px-4 py-2 text-left text-gray-500 cursor-pointer"
                      onClick={() => handleSort("timestamp")}
                    >
                      Date{" "}
                      {sortedField === "timestamp" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-4 py-2 text-left text-gray-500 cursor-pointer"
                      onClick={() => handleSort("timestamp")}
                    >
                      Time{" "}
                      {sortedField === "timestamp" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-4 py-2 text-left text-gray-500 cursor-pointer"
                      onClick={() => handleSort("from")}
                    >
                      From{" "}
                      {sortedField === "from" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-4 py-2 text-left text-gray-500 cursor-pointer"
                      onClick={() => handleSort("to")}
                    >
                      To{" "}
                      {sortedField === "to" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-4 py-2 text-left text-gray-500 cursor-pointer"
                      onClick={() => handleSort("amount")}
                    >
                      Amount{" "}
                      {sortedField === "amount" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-4 py-2 text-left text-gray-500 cursor-pointer"
                      onClick={() => handleSort("token")}
                    >
                      Token{" "}
                      {sortedField === "token" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th
                      className="px-4 py-2 text-left text-gray-500 cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      Status{" "}
                      {sortedField === "status" &&
                        (sortOrder === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="px-4 py-2 text-left text-gray-500">
                      Miner Wallet
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction._id} className="border-b">
                      <td className="px-4 py-2">
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(transaction.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-2">{truncateAddress(transaction.from)}</td>
                      <td className="px-4 py-2">{truncateAddress(transaction.to)}</td>
                      <td className="px-4 py-2">{transaction.amount}</td>
                      <td className="px-4 py-2">{transaction.token}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.status === "complete"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.status.charAt(0).toUpperCase() +
                            transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-2 flex items-center">
                        <span>{truncateAddress(transaction.minerWallet)}</span>

                        {transaction.minerWallet && (
                          <button
                            onClick={() => handleCopy(transaction.minerWallet)}
                            className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                          >
                            Copy
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default AllTransactions;

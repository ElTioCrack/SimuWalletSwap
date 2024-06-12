import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import GetPublicWalletsService from "../services/wallet/GetPublicWalletsService";

function AllWallets() {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc
  const [sortedField, setSortedField] = useState("createdAt");

  useEffect(() => {
    const fetchWallets = async () => {
      const response = await GetPublicWalletsService();
      if (response.success) {
        setWallets(response.data);
      } else {
        setError(response.message);
      }
      setLoading(false);
    };
    fetchWallets();
  }, []);

  const handleSort = (field) => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    setSortedField(field);

    const sortedWallets = [...wallets].sort((a, b) => {
      if (field === "createdAt") {
        const dateA = new Date(a[field]);
        const dateB = new Date(b[field]);
        return newOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        return newOrder === "asc"
          ? a[field].localeCompare(b[field])
          : b[field].localeCompare(a[field]);
      }
    });

    setWallets(sortedWallets);
  };

  return (
    <>
      <main className="container mx-auto px-4 py-8 min-h-screen">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">All Public Wallets</h2>
          {loading ? (
            <p>Loading wallets...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    className="px-4 py-2 text-left text-gray-500 cursor-pointer"
                    onClick={() => handleSort("publicKey")}
                  >
                    Public Key {sortedField === "publicKey" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th
                    className="px-4 py-2 text-left text-gray-500 cursor-pointer"
                    onClick={() => handleSort("createdAt")}
                  >
                    Created At {sortedField === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-4 py-2 text-left text-gray-500">Crypto Holdings</th>
                </tr>
              </thead>
              <tbody>
                {wallets.map((wallet) => (
                  <tr key={wallet._id} className="border-b hover:bg-gray-50 transition duration-200">
                    <td className="px-4 py-2 break-all">
                      <div className="flex items-center">
                        <span className="mr-2">{wallet.publicKey.substring(0, 6)}...{wallet.publicKey.substring(wallet.publicKey.length - 4)}</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(wallet.publicKey)}
                          className="text-blue-500 hover:text-blue-700 focus:outline-none"
                        >
                          Copy
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div>
                        <span>{new Date(wallet.createdAt).toLocaleDateString()}</span>
                        <span className="block text-gray-500 text-sm">{new Date(wallet.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      {wallet.cryptoHoldings.map((holding) => (
                        <div key={holding._id}>
                          {holding.token}: {holding.amount}
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </>
  );
}

export default AllWallets;

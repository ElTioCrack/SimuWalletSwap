import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { useAuth } from "../auth/AuthProvider.jsx";

const navigation = [
  { name: "Wallet", href: "/wallet" },
  { name: "Transactions", href: "/wallet/transactions" },
];

function NavBar() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-indigo-800 text-white py-4 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img
            src="../../public/WalletLogo.png"
            alt="Wallet Logo"
            className="h-10 w-10 mr-3"
          />
          <h1 className="text-3xl font-bold">Wallet App</h1>
        </Link>
        <nav className="flex-1 flex justify-center items-center">
          <ul className="flex space-x-6 text-lg">
            {navigation.map((item) => (
              <li key={item.name} className="hover:text-gray-300">
                <Link to={item.href}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex">
            <ThemeToggle />
          </div>
          {/* <button className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition duration-300">
            Settings
          </button> */}
          <button
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-300"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default NavBar;

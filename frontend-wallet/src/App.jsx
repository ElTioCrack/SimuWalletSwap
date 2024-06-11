import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import ThemeToggle from "./components/ThemeToggle";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

const navigation = [
  { name: "Wallets", href: "/allwallets" },
  { name: "Transactions", href: "/alltransactions" },
];

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-800">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img className="h-8 w-auto" src="/WalletLogo.png" alt="Wallet Logo" />
            </Link>
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-semibold leading-6 text-gray-900 dark:text-white"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <ThemeToggle />
          </div>
        </nav>

        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img className="h-8 w-auto" src="/WalletLogo.png" alt="Wallet Logo" />
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      <div className="flex-1 flex justify-center">
        <div className="flex justify-center items-center h-full max-w-2xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-5 text-gray-900 dark:text-white">
              Your Favorite Wallet
            </h1>
            <div className="flex justify-center items-center gap-8">
              <a
                href="https://vitejs.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-100 transition duration-300"
              >
                <img src="/vite.svg" className="w-10 h-10" alt="Vite logo" />
              </a>
              <a
                href="https://react.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center border border-gray-300 rounded-md p-2 hover:bg-gray-100 transition duration-300"
              >
                <img src={reactLogo} className="w-10 h-10" alt="React logo" />
              </a>
            </div>
            <h2 className="text-center mt-4 text-xl font-semibold dark:text-white">
              Vite + React
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-white">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab
              eveniet a iure unde numquam, excepturi illum consequuntur nulla
              ullam quod sit porro sequi corrupti quibusdam delectus itaque
              earum incidunt aut?
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/createwallet"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Create Wallet
              </Link>

              <Link
                to="/accesswallet"
                className="rounded-md bg-gray-200 px-3.5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
              >
                Access Wallet
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AuthProvider, { useAuth } from "./auth/AuthProvider";
import ProtectedRoute from "./auth/ProtectedRoute";

import {
  App,
  AccessWalletPage,
  CreateWalletPage,
  HelloWorldPage,
  NotFoundPage,
  WalletPage,
} from "./pages/MyPages";

import "./index.css";

import Example from "./pages/Example";
import Component from "./pages/component";
import TransactionsPage from "./pages/TransactionsPage";

const router = createBrowserRouter([
  {
    path: "/helloworld",
    element: <HelloWorldPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/createwallet",
    element: <CreateWalletPage />,
  },
  {
    path: "/accesswallet",
    element: <AccessWalletPage />,
  },
  {
    path: "/wallet",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/wallet",
        element: <WalletPage />,
      },
      {
        path: "/wallet/transactions",
        element: <TransactionsPage />,
      },
    ],
  },
]);

const MainApp = () => {
  const { publicKey } = useAuth();

  React.useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin === 'https://swap.example.com' && event.data.type === 'publicKeyRequest') {
        const publicKeyResponse = { type: 'publicKeyResponse', publicKey };
        window.postMessage(publicKeyResponse, event.origin);
      }
    };

    window.addEventListener('message', handleMessage);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [publicKey]);

  return <RouterProvider router={router} />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  </React.StrictMode>
);

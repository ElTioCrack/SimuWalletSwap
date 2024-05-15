import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AuthProvider from "./auth/AuthProvider";
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

const route = createBrowserRouter([
  {
    path: "/example",
    element: <Example />,
  },
  {
    path: "/component",
    element: <Component />,
  },
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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <React.StrictMode>
      <AuthProvider>
        <RouterProvider router={route} />
      </AuthProvider>
    </React.StrictMode>
  </>
);

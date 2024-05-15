import React from "react";
import { useAuth } from "../auth/AuthProvider.jsx";

function WalletPage() {
  const { logout } = useAuth();
  return (
    <>
      <h1>WalletPage</h1>
      <button onClick={() => logout()}>Logout</button>
    </>
);
}

export default WalletPage;

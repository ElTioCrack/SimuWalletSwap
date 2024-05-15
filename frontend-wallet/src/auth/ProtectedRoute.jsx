import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth();

  console.log(`isLoggedIn: ${isLoggedIn}`);

  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;

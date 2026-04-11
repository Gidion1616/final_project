// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // or useContext/Auth state

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;




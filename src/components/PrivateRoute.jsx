import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function PrivateRoute() {
  const token = localStorage.getItem("token");
  const usuario = localStorage.getItem("usuario");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const exp = decoded.exp * 1000;
    if (Date.now() > exp) {
      localStorage.clear();
      return <Navigate to="/login" replace />;
    }

    return <Outlet />;
  } catch (err) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }
}

export default PrivateRoute;
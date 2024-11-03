import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";

const RedirectIfLoggedIn = ({ children }) => {
  const { user } = useContext(AuthContext);

  return user ? <Navigate to="/" replace /> : children; // Redirect to home if logged in
};

export default RedirectIfLoggedIn;

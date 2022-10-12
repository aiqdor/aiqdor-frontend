import React, { useState, useContext } from "react";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import AuthContext, { AuthProvider } from "./context/auth";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const AppRoutes = () => {
  const Private = ( { children }: { children: JSX.Element } )  => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (isAuthenticated) {
      return children;
    } else {
      return <Navigate to="/login" />;
    }
  }
  
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Private><HomePage /></Private>} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;

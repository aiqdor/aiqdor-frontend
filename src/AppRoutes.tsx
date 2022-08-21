import React, { useState, useContext } from "react";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

import AuthContext, { AuthProvider } from "./context/auth";

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
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;

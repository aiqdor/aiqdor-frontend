import React, { useState } from "react";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

import { AuthContext } from "./context/auth";

const AppRoutes = () => {
  const [user, setUser] = useState(null);

  const login = (email: string, password: string) => {
    // setUser({ id = '123', email });
    console.log("login auth", { email, password });
  }

  const logout = () => {
    console.log('logout');
  }

  return (
    <Router>
      <AuthContext.Provider value={{isAuthenticated: !!user, user, login, logout}}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
        </Routes>
      </AuthContext.Provider>
    </Router>
  );
};

export default AppRoutes;

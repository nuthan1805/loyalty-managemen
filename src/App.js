import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import MainLayout from "./Layout";
import Login from "./components/Login";
import Registration from "./components/Registration";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
  };

  const handleRegister = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/" /> : <Registration onRegister={handleRegister} />} />
        <Route path="/*" element={isLoggedIn ? <MainLayout onLogout={handleLogout} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;

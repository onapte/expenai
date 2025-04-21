import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import AddExpenses from "./pages/AddExpenses";
import Expense from "./pages/Expense";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-expenses"
          element={
            <PrivateRoute>
              <AddExpenses />
            </PrivateRoute>
          }
        />
        <Route
          path="/expense/:id"
          element={
            <PrivateRoute>
              <Expense />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

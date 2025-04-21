import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/header.css";

const Header = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get("/api/logout", { withCredentials: true });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav>
      <div className="navbar">
        <div className="logo">
          <Link to="/">ExpenAI</Link>
        </div>
        <ul className="menu">
          {!isLoggedIn ? (
            <li>
              <Link to="/login">Login</Link>
            </li>
          ) : (
            <>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            </>
          )}
          <li>
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;

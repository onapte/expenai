import React, { useState } from "react";
import "../styles/style.css";
import Header from "../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "/api/login",
        { email, password },
        { withCredentials: true }
      );

      console.log("Login successful", res.data);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err.response?.data);
      setErrors(err.response?.data?.errors || {});
    }
  };

  return (
    <>
      <Header isLoggedIn={false} />
      <section className="container forms">
        <div className="form login">
          <div className="form-content">
            <header>Welcome back!</header>
            <form onSubmit={handleLogin} noValidate>
              <div className="field input-field">
                <input
                  type="email"
                  placeholder="Email"
                  className="input"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {errors.email && <p className="error-text">{errors.email}</p>}

              <div className="field input-field">
                <input
                  type="password"
                  placeholder="Password"
                  className="password"
                  id="pass"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <i className="bx bx-hide eye-icon"></i>
              </div>
              {errors.password && (
                <p className="error-text">{errors.password}</p>
              )}

              <div className="field button-field">
                <button type="submit">Login</button>
              </div>
            </form>

            <div className="form-link">
              <span>
                Don't have an account? <a href="/signup">Signup</a>
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;

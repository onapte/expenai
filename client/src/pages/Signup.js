import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";
import Header from "../components/Header";
import axios from "axios";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      return setError("Passwords do not match.");
    }

    try {
      const res = await axios.post(
        "/api/signup",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Signup failed:", err);
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <>
      <Header isLoggedIn={false} />
      <section className="container forms">
        <div className="form signup">
          <div className="form-content">
            <header>Signup</header>
            <form onSubmit={handleSignup} noValidate>
              <div className="field input-field">
                <input
                  type="email"
                  placeholder="Email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="field input-field">
                <input
                  type="password"
                  placeholder="Create password"
                  className="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="field input-field">
                <input
                  type="password"
                  placeholder="Confirm password"
                  className="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>

              {error && <div className="error-text">{error}</div>}

              <div className="field button-field">
                <button type="submit">Signup</button>
              </div>
            </form>

            <div className="form-link">
              <span>
                Already have an account? <a href="/login">Login</a>
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;

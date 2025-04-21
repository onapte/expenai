import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "../styles/home_style.css";
import axios from "axios";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get("/api/check-auth", {
          withCredentials: true,
        });
        setIsLoggedIn(res.data.authenticated);
      } catch (err) {
        console.error("Failed to check login:", err);
        setIsLoggedIn(false); // fallback
      }
    };

    checkLogin();
  }, []);

  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      <section>
        <img src="/images/budget_home.png" alt="Home Budget Visual" />
      </section>
      <div className="button">
        <a href="#Home">
          <i className="fas fa-arrow-up"></i>
        </a>
      </div>
    </>
  );
};

export default Home;

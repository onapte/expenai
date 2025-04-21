import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../styles/dashboard.css";
import axios from "axios";

const Dashboard = () => {
  const [receipts, setReceipts] = useState([]);
  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [lastPurchase, setLastPurchase] = useState(0);
  const [lastMonthPurchase, setLastMonthPurchase] = useState(0);
  const [totalPurchasedAmount, setTotalPurchasedAmount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = await axios.get("/api/check-auth", {
          withCredentials: true,
        });
        setIsLoggedIn(auth.data.authenticated);

        const res = await axios.get("/api/dashboard", {
          withCredentials: true,
        });
        setReceipts(res.data.receipts);
        setImg1(res.data.img1);
        setImg2(res.data.img2);
        setLastPurchase(res.data.lastPurchase);
        setLastMonthPurchase(res.data.lastMonthPurchase);
        setTotalPurchasedAmount(res.data.totalPurchasedAmount);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = String(date.getFullYear()).slice(-2);
    const hour = date.getHours() % 12 || 12;
    const minute = String(date.getMinutes()).padStart(2, "0");
    const ampm = date.getHours() < 12 ? "am" : "pm";

    return `${day} ${month}. ${year}, ${hour}:${minute} ${ampm}`;
  };

  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      <main className="container">
        <div className="dashboard-title">Welcome!</div>

        <div className="dashboard-layout">
          <div className="summary-box">
            <div className="box" style={{ backgroundColor: "#E0F2F1" }}>
              <div className="label">Last Purchase</div>
              <div className="amount">${lastPurchase}</div>
            </div>
            <div className="box" style={{ backgroundColor: "#F3E5F5" }}>
              <div className="label">Last Month Purchase</div>
              <div className="amount">${lastMonthPurchase}</div>
            </div>
            <div className="box" style={{ backgroundColor: "#FFF3E0" }}>
              <div className="label">Total Expenses</div>
              <div className="amount">${totalPurchasedAmount}</div>
            </div>
          </div>

          <div className="right-box">
            <table>
              <thead>
                <tr>
                  <th>Store Name</th>
                  <th>Store Location</th>
                  <th>Date</th>
                  <th>Expenses</th>
                </tr>
              </thead>
              <tbody>
                {receipts.length > 0 ? (
                  receipts.map((receipt) => {
                    const total =
                      receipt.expenseDetails
                        ?.reduce(
                          (sum, exp) => sum + exp.price * exp.quantity,
                          0
                        )
                        .toFixed(3) || 0;

                    return (
                      <tr
                        key={receipt._id}
                        className="clickable-row"
                        onClick={() => navigate(`/expense/${receipt._id}`)}
                      >
                        <td>{receipt.storeName}</td>
                        <td>{receipt.storeLocation}</td>
                        <td>{formatDate(receipt.date)}</td>
                        <td>${total}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      style={{ textAlign: "center", color: "#999" }}
                    >
                      No receipts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div id="view-table-button">
              <a href="/add-expenses" className="button-link">
                Add expenses
              </a>
            </div>
          </div>
        </div>

        <div id="viz-area">
          {img2 && (
            <div id="viz-area1">
              <img src={img2} alt="Expenses Over Time" />
            </div>
          )}
          {img1 && (
            <div id="viz-area2">
              <img src={img1} alt="Recent Expenses" />
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Dashboard;

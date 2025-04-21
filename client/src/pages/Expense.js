import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";
import "../styles/style.css";

const Expense = () => {
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const res = await axios.get(`/api/receipt/${id}`, {
          withCredentials: true,
        });
        setReceipt(res.data);
      } catch (err) {
        console.error("Failed to load receipt:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [id]);

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!receipt) return <div className="loading-screen">Receipt not found</div>;

  const total = receipt.expenses
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  return (
    <>
      <Header isLoggedIn={true} />
      <div className="receipt-container">
        <div className="receipt-card">
          <div className="receipt-left">
            {receipt.receiptUrl && (
              <img
                src={receipt.receiptUrl}
                alt="Receipt"
                className="receipt-image"
              />
            )}
          </div>
          <div className="receipt-right">
            <h2>{receipt.storeName}</h2>
            <p className="receipt-address">{receipt.storeLocation}</p>
            <p className="receipt-date">
              {new Date(receipt.date).toLocaleString()}
            </p>

            <h3>Items Purchased</h3>
            <ul className="item-list">
              {receipt.expenses.map((item, i) => (
                <li key={i}>
                  <span>{item.itemName}</span>
                  <span>
                    {item.quantity} × ${item.price.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="receipt-total">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Expense;

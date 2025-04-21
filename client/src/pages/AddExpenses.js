import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";
import Header from "../components/Header";
import axios from "axios";

const AddExpenses = () => {
  const [storeName, setStoreName] = useState("");
  const [storeLocation, setStoreLocation] = useState("");
  const [items, setItems] = useState([{ name: "", price: "", quantity: "" }]);
  const [showUploadBox, setShowUploadBox] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handleAddItem = (e) => {
    e.preventDefault();
    setItems([...items, { name: "", price: "", quantity: "" }]);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setReceiptFile(file);
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("/api/parse-receipt", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      const { storeName, storeLocation, items } = res.data;

      setStoreName(storeName || "");
      setStoreLocation(storeLocation || "");
      setItems(items.length ? items : [{ name: "", price: "", quantity: "" }]);
    } catch (err) {
      console.error("Error parsing receipt:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("storeName", storeName);
      formData.append("storeLocation", storeLocation);
      formData.append("items", JSON.stringify(items));

      if (receiptFile) {
        formData.append("receiptFile", receiptFile);
      }

      // const payload = { storeName, storeLocation, items, receiptFile };

      const res = await axios.post("/api/add-expenses", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      console.log("Success:", res.data);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <>
      <Header isLoggedIn={true} />
      <section className="container forms">
        <div className="form add-expenses">
          <div className="form-content">
            <header>Add Expenses</header>
            <form onSubmit={handleSubmit}>
              {/* Toggle Upload Box */}
              <div className="field button-field">
                <button
                  type="button"
                  id="upload-image"
                  onClick={() => setShowUploadBox((prev) => !prev)}
                >
                  Auto-fill with AI by uploading receipt
                </button>
              </div>

              {showUploadBox && (
                <div className="field input-field">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <button
                    type="button"
                    style={{
                      background: "transparent",
                      color: "red",
                      fontWeight: "bold",
                      border: "none",
                      marginTop: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setShowUploadBox(false);
                      fileInputRef.current.value = null;
                    }}
                  >
                    ✕ Cancel upload
                  </button>
                </div>
              )}

              <div className="field input-field store-name-field">
                <input
                  type="text"
                  placeholder="Store name"
                  className="input"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                />
              </div>

              <div className="field input-field">
                <input
                  type="text"
                  placeholder="Store location"
                  className="input"
                  value={storeLocation}
                  onChange={(e) => setStoreLocation(e.target.value)}
                />
              </div>

              <div className="items-section">
                {items.map((item, index) => (
                  <div className="item-entry" key={index}>
                    <div className="field input-field">
                      <input
                        type="text"
                        placeholder="Item name"
                        className="input"
                        value={item.name}
                        onChange={(e) =>
                          handleItemChange(index, "name", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="field input-field">
                      <input
                        type="number"
                        placeholder="Price"
                        className="input"
                        value={item.price}
                        onChange={(e) =>
                          handleItemChange(index, "price", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="field input-field">
                      <input
                        type="number"
                        placeholder="Quantity"
                        className="input"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(index, "quantity", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="field button-field add-button-field">
                <button type="button" onClick={handleAddItem}>
                  Add Item
                </button>
              </div>

              <div className="field button-field">
                <button type="submit">Track expenses</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddExpenses;

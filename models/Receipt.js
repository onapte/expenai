const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  storeName: {
    type: String,
  },
  storeLocation: {
    type: String,
  },
  expenseIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "expense",
    },
  ],
  receiptUrl: {
    type: String,
    default: null,
  },
  date: {
    type: String,
    default: new Date().toISOString().slice(0, 19).replace("T", " "),
  },
});

const Receipt = mongoose.model("receipt", receiptSchema);

module.exports = Receipt;

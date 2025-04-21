const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const dataRoutes = require("./routes/dataRoutes");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
const {
  getUser,
  getReceipts,
  getExpensesByReceipt,
  getTotalExpensesByDate,
} = require("./middleware/infoMiddleware");
const {
  lineChart_ExpensesByDate,
  lineChart_ExpensesComplete,
} = require("./middleware/chartsMiddleware");

const dashboardCache = require("./utils/cache");

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const dbUri =
  "mongodb+srv://onapte:Mongo12345@cluster0.rioxj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(dbUri).then(() => {
  app.listen(3001, () => {
    console.log("Express server running on http://localhost:3001");
  });
});

app.get("*", checkUser);

app.get("/api/dashboard", requireAuth, async (req, res) => {
  try {
    const user = await getUser(req, res);
    const cacheKey = `dashboard-${user._id}`;

    const cached = dashboardCache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const receipts = await getReceipts(req, res);

    const data1 = await getTotalExpensesByDate(req, res);
    const img1 = await lineChart_ExpensesByDate(data1, user._id);
    const img2 = await lineChart_ExpensesComplete(data1, user._id);

    let totalPurchasedAmount = 0;
    for (const d of data1) totalPurchasedAmount += d.total;
    totalPurchasedAmount = totalPurchasedAmount.toFixed(3);

    let lastPurchase = data1.length
      ? data1[data1.length - 1].total.toFixed(3)
      : 0;
    let lastMonthPurchase = 0;
    const currentDate = new Date();
    const lastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1
    );

    for (const d of data1) {
      const dDate = new Date(d.date);
      if (
        dDate.getMonth() === lastMonth.getMonth() &&
        dDate.getFullYear() === lastMonth.getFullYear()
      ) {
        lastMonthPurchase += d.total;
      }
    }

    const dashboardData = {
      receipts,
      img1,
      img2,
      lastPurchase,
      totalPurchasedAmount,
      lastMonthPurchase: lastMonthPurchase.toFixed(3),
    };

    dashboardCache.set(cacheKey, dashboardData);
    res.json(dashboardData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.use("/api", dataRoutes);
app.use("/api", authRoutes);

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

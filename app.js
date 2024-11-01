const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const { getUser, getReceipts, getExpensesByReceipt, getTotalExpensesByDate } = require('./middleware/infoMiddleware');
const { lineChart_ExpensesByDate, lineChart_ExpensesComplete } = require('./middleware/chartsMiddleware')
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'ejs');

const dbUri = 'mongodb+srv://onapte:12345@cluster0.rioxj.mongodb.net/expenai_main'
mongoose.connect(dbUri)
.then((result) => app.listen(3000))
.catch((err) => console.log(err));

app.get('*', checkUser);


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/dashboard', requireAuth, async (req, res) => {
    try {
        const user = await getUser(req, res);
        const receipts = await getReceipts(req, res);

        const data1 = await getTotalExpensesByDate(req, res);
        const img1 = await lineChart_ExpensesByDate(data1, user._id);
        const img2 = await lineChart_ExpensesComplete(data1, user._id);

        const lastPurchaseDetails = data1.slice(-1)
        let lastPurchase = lastPurchaseDetails[0].total.toFixed(3);

        let totalPurchasedAmount = 0;
        for (const d of data1) totalPurchasedAmount += d.total;
        totalPurchasedAmount = totalPurchasedAmount.toFixed(3);

        let lastMonthPurchase = 0;
        const currentDate = new Date()
        const currentMonth = currentDate.getMonth()+1;
        const currentYear = currentDate.getFullYear();
        let lastMonth, lastYear = currentYear;
        if (currentMonth == 0) lastMonth == 12;
        else lastMonth = currentMonth-1;

        if (lastMonth == 12) lastYear -= 1;

        for (const d of data1) {
            let dateString = d.date;
            let literals = dateString.split('-');
            let purYear = parseInt(literals[0]), purMonth = parseInt(literals[1]);

            if (purYear == lastYear && purMonth == lastMonth) lastMonthPurchase += d.total;
        }

        console.log("Last purchase detail:\n", lastPurchaseDetails);

        res.render('dashboard', {
            'res': res,
            'img1': img1,
            'img2': img2,
            'lastPurchase': lastPurchase,
            'totalPurchasedAmount': totalPurchasedAmount,
            'lastMonthPurchase': lastMonthPurchase,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error!");
    }
});

app.use(dataRoutes);
app.use(authRoutes);
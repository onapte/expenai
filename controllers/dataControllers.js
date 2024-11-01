const User = require('../models/User');
const Expense = require('../models/Expense');
const Receipt = require('../models/Receipt');
const jwt = require('jsonwebtoken');
const { getUser } = require('../middleware/infoMiddleware');
const { getReceiptDetails } = require('../utils/ReadReceipt');

module.exports.addExpenses_get = (req, res) => {
    res.render('add_expenses');
};

module.exports.addExpenses_post = async (req, res) => {
    try {
        const user = await getUser(req, res);

        const items = req.body.items;

        const expensePromises = items.map(async (item) => {
            return await Expense.create({
                itemName: item.name,
                price: item.price,
                quantity: item.quantity
            });
        });

        const expenses = await Promise.all(expensePromises);
        const expenseIds = expenses.map(expense => expense._id);

        console.log("Below are the expenseIds");
        console.log(expenseIds);

        const receipt = await Receipt.create({
            userId: user._id,
            storeName: req.body.storeName,
            storeLocation: req.body.storeLocation,
            expenseIds: expenseIds,
        });

        res.status(201).json({ Message: "Success", ReceiptId: receipt._id });
    }
    catch (err) {
        console.log(err);
    }
};

module.exports.ReceiptImage_post = async (req, res) => {
    try {
        const user = await getUser(req, res);
        const file = req.body.imageFile
        const filestream = file.stream()

        const receiptDetails = await getReceiptDetails(filestream);
    }
    catch (err) {
        console.error(err);
    }
}
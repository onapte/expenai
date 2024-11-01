const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Receipt = require('../models/Receipt');
const Expense = require('../models/Expense');

const getUser = async (req, res) => {
    const token = req.cookies.jwt;
    
    const decodedToken = jwt.decode(token, 'expenai secret');
    let user = await User.findById(decodedToken.id);

    return user;
};

const getReceipts = async (req, res) => {
    const user = await getUser(req, res);

    let receipts = [];

    const query = {
        userId: { $eq:user._id }
    }

    const options = {
        sort: { date:-1 }
    }

    try {
        const cursor = await Receipt.find(query, options).lean();
        const counts = await Receipt.countDocuments(query, options);

        if (counts == 0) {
            console.log("No receipts found!");
            res.locals.receipts = null;
            return receipts;
        }

        for (const doc of cursor) {
            const receiptDoc = await Receipt.findById(doc._id)

            let receipt = {
                storeName: receiptDoc.storeName,
                storeLocation: receiptDoc.storeLocation,
                expenseIds: receiptDoc.expenseIds,
                date: receiptDoc.date
            };

            req.body.receipt = receipt;
            
            const expenses = await getExpensesByReceipt(req, res, doc._id);
            
            receipt.expenseDetails = expenses;
            receipts.push(receipt);
        }


        res.locals.receipts = receipts;
        console.log(receipts);
        return receipts;
    }
    catch(err) {
        console.error(err);
        res.locals.receipts = null;
        throw err;
    }

    
};

// Get details of each expense in a receipt
const getExpensesByReceipt = async (req, res, receiptId) => {
    const receipt = await Receipt.findById(receiptId);
    const expenseIds = receipt.expenseIds;

    const expensePromises = expenseIds.map(async expenseId => {
        const expense = await Expense.findById(expenseId);

        return {
            itemName: expense.itemName,
            price: expense.price,
            quantity: expense.quantity
        };
    });

    const expenses = await Promise.all(expensePromises);

    res.locals.expenses = expenses;
    return expenses;
};

const getTotalExpensesByDate = async (req, res) => {
    let receipts = await getReceipts(req, res);

    let result = []
    receipts.forEach(receipt => {
        let data = {
            total: 0.0,
            date: receipt.date
        }

        let total_cost = 0.0;


        receipt.expenseDetails.forEach(expense => {
            total_cost += expense.price * expense.quantity;
        })

        data.total = total_cost
        result.push(data);
    });

    return result;
}

module.exports = {
    getUser, getReceipts, getExpensesByReceipt, getTotalExpensesByDate
};
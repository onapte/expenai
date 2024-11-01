const mongoose = require('mongoose');

const expenseSchema = mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number
    }
});

const Expense = mongoose.model('expense', expenseSchema);

module.exports = Expense;
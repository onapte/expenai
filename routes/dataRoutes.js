const { Router } = require('express');
const dataController = require('../controllers/dataControllers');

const router = Router();

router.get('/add-expenses', dataController.addExpenses_get);
router.post('/add-expenses', dataController.addExpenses_post);

//router.post('/receipt-image', dataController.receiptImage_post);

module.exports = router;
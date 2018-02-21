const CurrencyController = require('../controllers/CurrencyController');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(CurrencyController.getCurrencys)
    .post(CurrencyController.createCurrency);
router.route('/:id')
    .get(CurrencyController.getCurrencyById)
    .put(CurrencyController.updateCurrency)
    .delete(CurrencyController.removeCurrency);

module.exports = router;

const CurrencyController = require('../controllers/CurrencyController');
const express = require('express');

let permission = require('../middleware/authorizarion/index');

const router = express.Router();

router.route('/')
    .get(CurrencyController.getCurrencys)
    .post(permission(),CurrencyController.createCurrency);
router.route('/:id')
    .get(CurrencyController.getCurrencyById)
    .put(permission(),CurrencyController.updateCurrency)
    .delete(permission(),CurrencyController.removeCurrency);

module.exports = router;

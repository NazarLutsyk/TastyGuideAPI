const CurrencyController = require(global.paths.CONTROLLERS + '/CurrencyController');
const express = require('express');

let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');

const router = express.Router();

router.route('/')
    .get(CurrencyController.getCurrencys)
    .post(permission(),CurrencyController.createCurrency);
router.route('/:id')
    .get(CurrencyController.getCurrencyById)
    .put(permission(),CurrencyController.updateCurrency)
    .delete(permission(),CurrencyController.removeCurrency);

module.exports = router;

let Currency = require('../models/Currency');

module.exports = {
    async getCurrencys(req, res) {
        try {
            let currencies = await Currency.find({});
            res.json(currencys);
        } catch (e) {
            res.json(e);
        }
    },
    async getCurrencyById(req, res) {
        let currencyId = req.params.id;
        try {
            let currency = await Currency.findById(currencyId);
            res.json(currency);
        } catch (e) {
            res.json(e);
        }
    },
    async createCurrency(req, res) {
        try {
            let currency = await Currency.create(req.body);
            res.json(currency);
        } catch (e) {
            res.json(e);
        }
    },
    async updateCurrency(req, res) {
        let currencyId = req.params.id;
        try {
            let currency = await Currency.findByIdAndUpdate(currencyId, req.body,{new : true});
            res.json(currency);
        } catch (e) {
            res.json(e);
        }
    },
    async removeCurrency(req, res) {
        let currencyId = req.params.id;
        try {
            let currency = await Currency.findById(currencyId);
            currency = await currency.remove();
            res.json(currency);
        } catch (e) {
            res.json(e);
        }
    }
};
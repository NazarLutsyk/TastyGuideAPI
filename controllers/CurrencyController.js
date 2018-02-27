let Currency = require('../models/Currency');

module.exports = {
    async getCurrencys(req, res) {
        try {
            let currencyQuery = Currency
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    currencyQuery.populate(populateField);
                }
            }
            let currencies = await currencyQuery.exec();
            res.json(currencies);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async getCurrencyById(req, res) {
        let currencyId = req.params.id;
        try {
            let currenccyQuery = Currency.find({_id: currencyId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    currenccyQuery.populate(populateField);
                }
            }
            let currency = await currenccyQuery.exec();
            res.json(currency);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async createCurrency(req, res) {
        try {
            let currency = await Currency.create(req.body);
            res.status(201).json(currency);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updateCurrency(req, res) {
        let currencyId = req.params.id;
        try {
            let currency = await Currency.findByIdAndUpdate(currencyId, req.body,{new : true});
            res.status(201).json(currency);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeCurrency(req, res) {
        let currencyId = req.params.id;
        try {
            let currency = await Currency.findById(currencyId);
            currency = await currency.remove();
            res.status(204).json(currency);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};
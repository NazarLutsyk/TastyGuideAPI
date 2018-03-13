let Currency = require(global.paths.MODELS + '/Currency');
let keysValidator = require(global.paths.VALIDATORS + '/keysValidator');
let objectHelper = require(global.paths.HELPERS + '/objectHelper');

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
            res.status(400).send(e.toString());
        }
    },
    async getCurrencyById(req, res) {
        let currencyId = req.params.id;
        try {
            let currenccyQuery = Currency.findOne({_id: currencyId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    currenccyQuery.populate(populateField);
                }
            }
            let currency = await currenccyQuery.exec();
            res.json(currency);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async createCurrency(req, res) {
        try {
            let err = keysValidator.diff(Currency.schema.tree, req.body);
            if (err){
                throw new Error('Unknown fields ' + err);
            } else {
                let currency = await Currency.create(req.body);
                res.status(201).json(currency);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updateCurrency(req, res) {
        let currencyId = req.params.id;
        try {
            let err = keysValidator.diff(Currency.schema.tree, req.body);
            if (err){
                throw new Error('Unknown fields ' + err);
            } else {
                let currency = await Currency.findById(currencyId);
                if (currency) {
                    objectHelper.load(currency, req.body);
                    let updated = await currency.save();
                    res.status(201).json(updated);
                }else {
                    res.sendStatus(404);
                }
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeCurrency(req, res) {
        let currencyId = req.params.id;
        try {
            let currency = await Currency.findById(currencyId);
            if (currency) {
                currency = await currency.remove();
                res.status(204).json(currency);
            }else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};
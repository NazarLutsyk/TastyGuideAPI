let Promo = require("../models/Promo");
let keysValidator = require("../validators/keysValidator");
let objectHelper = require("../helpers/objectHelper");

module.exports = {
    async getPromos(req, res, next) {
        try {
            res.json(await Promo.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getPromoById(req, res, next) {
        let promoId = req.params.id;
        try {
            req.query.query._id = promoId;
            let promo = await Promo.superfind(req.query);
            res.json(promo[0]);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    }
};
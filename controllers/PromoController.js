let Promo = require("../models/Promo");
let mongoose = require('mongoose');

module.exports = {
    async getPromos(req, res, next) {
        try {
            if (JSON.stringify(req.query).search(/^[0-9a-fA-F]{24}$/)) {
                function iterate(obj, stack) {
                    for (let property in obj) {
                        if (obj.hasOwnProperty(property)) {
                            if (typeof obj[property] === "object") {
                                iterate(obj[property], stack + "." + property);
                            } else if (typeof obj[property] === "string" && obj[property].match(/^[0-9a-fA-F]{24}$/)) {
                                obj[property] = mongoose.Types.ObjectId(obj[property]);
                            }
                        }
                    }
                }

                iterate(req.query, "");
            }
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
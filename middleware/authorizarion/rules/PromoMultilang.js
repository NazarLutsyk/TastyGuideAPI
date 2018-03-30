let Department = require("../../../models/Department");
let Promo = require("../../../models/Promo");
let Multilang = require("../../../models/Multilang");
let Place = require("../../../models/Place");
module.exports = {
    async createPromoMultilang(req, res, next) {
        try {
            log('rule create PromoMultilang');
            let allowed = 0;
            let user = req.user;
            let promoId = req.body.promo;

            let promo = await Promo.findById(promoId);
            if (promo) {
                allowed = await Department.count({
                    client: user._id,
                    place: promo.place
                });
            }
            if (allowed > 0) {
                return next();
            } else {
                let error = new Error();
                error.status = 403;
                error.message = "Forbidden";
                return next(error);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async updatePromoMultilang(req, res, next) {
        try {
            log('rule update PromoMultilang');
            let allowed = 0;
            let user = req.user;
            let multilangId = req.params.id;

            let multilang = await Multilang.findById(multilangId);
            let promo = await Promo.findOne({_id: multilang.promo});
            if (promo) {
                let place = await Place.findOne({_id: promo.place});
                allowed = await Department.count({
                    client: user._id,
                    place: place._id
                });
            }
            if (allowed > 0) {
                return next();
            } else {
                let error = new Error();
                error.status = 403;
                error.message = "Forbidden";
                return next(error);
            }
        } catch (e) {
            e.status = 400;
            return next(error);
        }
    }
};
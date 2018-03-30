let Department = require("../../../models/Department");
let Place = require("../../../models/Place");
let Promo = require("../../../models/Promo");
module.exports = {
    async createPromo(req, res, next) {
        try {
            let user = req.user;
            let placeId = req.body.place;
            let allowed = await Department.count({
                client: user._id,
                place: placeId
            });
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
    async updatePromo(req, res, next) {
        try {
            let allowed = 0;
            let user = req.user;
            let promoId = req.params.id;

            let promo = await Promo.findById(promoId);
            if (promo) {
                let place = await Place.findOne({_id: promo.place});
                allowed = await Department.count({
                    place: place._id,
                    client: user._id
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
            return res.status(400).send(e.toString());
        }
    }
};
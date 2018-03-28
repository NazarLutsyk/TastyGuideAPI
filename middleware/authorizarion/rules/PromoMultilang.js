let Department = require(global.paths.MODELS + '/Department');
let Promo = require(global.paths.MODELS + '/Promo');
let Multilang = require(global.paths.MODELS + '/Multilang');
let Place = require(global.paths.MODELS + '/Place');
module.exports = {
    async createPromoMultilang(req, res, next) {
        try {
            let user = req.user;
            let promoId = req.body.promo;
            let promo = await Promo.findById(promoId);

            let allowed = await Department.count({
                client: user._id,
                place: promo.place
            });
            if (allowed > 0) {
                next();
            } else {
                res.sendStatus(403);
            }
        } catch (e) {
            return res.status(400).send(e.toString());
        }
    },
    async updatePromoMultilang(req, res, next) {
        try {
            let user = req.user;
            let multilangId = req.body.id;

            let multilang = await Multilang.findById(multilangId);
            let promo = await Promo.findOne({_id: multilang.promo});
            let place = await Place.findOne({_id: promo.place});

            let allowed = await Department.count({
                client: user._id,
                place: place._id
            });
            if (allowed > 0) {
                next();
            } else {
                res.sendStatus(403);
            }
        } catch (e) {
            return res.status(400).send(e.toString());
        }
    }
};
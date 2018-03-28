let Department = require(global.paths.MODELS + '/Department');
let Place = require(global.paths.MODELS + '/Place');
let Promo = require(global.paths.MODELS + '/Promo');
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
                next();
            } else {
                res.sendStatus(403);
            }
        } catch (e) {
            return res.status(400).send(e.toString());
        }
    },
    async updatePromo(req,res,next) {
        try {
            let user = req.user;
            let promoId = req.body.id;

            let promo = await Promo.findById(promoId);
            let place = await Place.findOne({_id: promo.place});

            let allowed = await Department.count({
                place: place._id,
                client: user._id
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
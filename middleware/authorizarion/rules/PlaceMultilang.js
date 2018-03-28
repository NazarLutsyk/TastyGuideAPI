let Department = require(global.paths.MODELS + '/Department');
let Place = require(global.paths.MODELS + '/Place');
let Multilang = require(global.paths.MODELS + '/PlaceMultilang');
module.exports = {
    async createPlaceMultilang(req, res, next) {
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
    async updatePlaceMultilang(req, res, next) {
        try {
            let user = req.user;
            let multilangId = req.body.id;

            let multilang = await Multilang.findById(multilangId);
            let place = await Place.findOne({_id: multilang.place});

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
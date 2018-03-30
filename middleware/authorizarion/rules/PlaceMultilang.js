let Department = require("../../../models/Department");
let Place = require("../../../models/Place");
let Multilang = require("../../../models/PlaceMultilang");
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
    async updatePlaceMultilang(req, res, next) {
        try {
            let allowed = 0;
            let user = req.user;
            let multilangId = req.params.id;

            let multilang = await Multilang.findById(multilangId);
            if (multilang) {
                let place = await Place.findOne({_id: multilang.place});
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
            return res.status(400).send(e.toString());
        }
    }
};
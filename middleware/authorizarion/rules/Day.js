let Department = require("../../../models/Department");
let Place = require("../../../models/Place");
let Day = require("../../../models/Day");
module.exports = {
    async createDay(req, res, next) {
        try {
            log('rule create Day');
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
    async updateDay(req, res, next) {
        try {
            log('rule update Day');
            let allowed = 0;
            let user = req.user;
            let dayId = req.params.id;

            let day = await Day.findById(dayId);
            if (day) {
                let place = await Place.findOne({_id: day.place});
                allowed = await Department.count({
                    place: place._id,
                    client: user._id
                });
            }
            if (allowed > 0) {
                return next();
            } else {
                let error = new Error();
                error.message = "Forbidden";
                error.status = 403;
                return next(error);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    }
};
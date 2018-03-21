let Department = require(global.paths.MODELS + '/Department');
let Place = require(global.paths.MODELS + '/Place');
let Day = require(global.paths.MODELS + '/Day');
module.exports = {
    async createDay(req, res, next) {
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
    },
    async updateDay(req, res, next) {
        let user = req.user;
        let dayId = req.body.id;

        let day = await Day.findById(dayId);
        let place = await Place.findOne({_id: day.place});

        let allowed = await Department.count({
            place: place._id,
            client: user._id
        });
        if (allowed > 0) {
            next();
        } else {
            res.sendStatus(403);
        }
    }
};
let Department = require('../../../models/Department');
let Place = require('../../../models/Place');
let PlaceMultilang = require('../../../models/PlaceMultilang');
module.exports = {
    async updatePlaceMultilang(req, res, next) {
        let user = req.user;
        let multilangId = req.params.id;
        if (user && user.departments && user.departments.length > 0) {
            let placeMultilang = await PlaceMultilang.findById(multilangId);
            let place = await Place.findById(placeMultilang.place);
            let allowed = await Department.count({
                place: place.place,
                client: user.departments
            });
            if (allowed > 0) {
                next();
            } else {
                res.sendStatus(403);
            }
        } else {
            res.sendStatus(403);
        }
    }
};
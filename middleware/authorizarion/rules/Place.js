let Department = require("../../../models/Department");

let ROLES = require("../../../config/roles");
module.exports = {
    async updatePlace(req, res, next) {
        try {
            log('rule update Place');
            let user = req.user;
            let placeId = req.params.id;
            let allowed = await Department.count({
                client: user._id,
                place: placeId
            });
            if (allowed > 0) {
                return next();
            } else {
                let error = new Error();
                error.status = 403;
                return next(error);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async deletePlace(req, res, next) {
        try {
            log('rule delete Place');
            let user = req.user;
            let placeId = req.params.id;
            let allowed = await Department.count({
                client: user._id,
                place: placeId,
                roles: ROLES.PLACE_ROLES.BOSS_ROLE
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
            return res.status(400).send(e.toString());
        }
    }
};
let Place = require("../../../models/Place");
let Department = require("../../../models/Department");
let ROLES = require("../../../config/roles");
module.exports = {
    async createDepartment(req, res, next) {
        try {
            let user = req.user;
            let placeId = req.body.place;

            let allowed = await Department.count({
                client: user._id,
                place: placeId,
                roles: ROLES.PLACE_ROLES.BOSS_ROLE
            });
            if (allowed > 0) {
                return next();
            } else {
                let error = new Error();
                error.message = "Forbidden";
                error.status = 403;
                return next(error);
            }
        } catch (e) {
            return res.status(400).send(e.toString());
        }
    },
    async updateDepartment(req, res, next) {
        try {
            let allowed = 0;
            let user = req.user;
            let departmentId = req.params.id;

            let department = await Department.findById(departmentId);
            if (department) {
                let place = await Place.findOne({_id: department.place});
                allowed = await Department.count({
                    place: place._id,
                    client: user._id,
                    roles: ROLES.PLACE_ROLES.BOSS_ROLE
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
let Place = require(global.paths.MODELS + '/Place');
let Department = require(global.paths.MODELS + '/Department');
let ROLES = require(global.paths.CONFIG + '/roles');
module.exports = {
    async createDepartment(req, res, next) {
        let user = req.user;
        let placeId = req.body.place;

        let allowed = await Department.count({
            client: user._id,
            place: placeId,
            roles : ROLES.PLACE_ROLES.BOSS_ROLE
        });
        if (allowed > 0) {
            next();
        } else {
            res.sendStatus(403);
        }
    },
    async updateDepartment(req, res, next) {
        let user = req.user;
        let departmentId = req.body.id;

        let department = await Department.findById(departmentId);
        let place = await Place.findOne({_id: department.place});

        let allowed = await Department.count({
            place: place._id,
            client: user._id,
            roles : ROLES.PLACE_ROLES.BOSS_ROLE
        });
        if (allowed > 0) {
            next();
        } else {
            res.sendStatus(403);
        }
    }
};
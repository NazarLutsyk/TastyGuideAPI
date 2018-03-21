let Department = require(global.paths.MODELS + '/Department');
let ROLES = require(global.paths.CONFIG + '/roles');
module.exports = {
    async updatePlace(req, res, next) {
        let user = req.user;
        let placeId = req.params.id;
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
    async deletePlace(req, res, next) {
        let user = req.user;
        let placeId = req.params.id;
        let allowed = await Department.count({
            client: user._id,
            place: placeId,
            roles: ROLES.PLACE_ROLES.BOSS_ROLE
        });
        if (allowed > 0) {
            next();
        } else {
            res.sendStatus(403);
        }
    }
};
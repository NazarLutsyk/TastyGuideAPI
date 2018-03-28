let Department = require(global.paths.MODELS + '/Department');
let Place = require(global.paths.MODELS + '/Place');
let ROLES = require(global.paths.CONFIG + '/roles');
module.exports = {
    async updatable(req,res,next){
        try {
            for (let key of Object.keys(req.body)) {
                if (Place.notUpdatable().indexOf(key) !== -1) {
                    return res.sendStatus(403);
                }
            }
            return next();
        } catch (e) {
            return res.status(400).send(e.toString());
        }
    },
    async updatePlace(req, res, next) {
        try {
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
        } catch (e) {
            return res.status(400).send(e.toString());
        }
    },
    async deletePlace(req, res, next) {
        try {
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
        } catch (e) {
            return res.status(400).send(e.toString());
        }
    }
};
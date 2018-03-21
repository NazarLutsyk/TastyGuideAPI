let Department = require(global.paths.MODELS + '/Department');
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
    }
};
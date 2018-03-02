let Department = require('../../../models/Department');
module.exports = {
    async updatePlace(req,res,next) {
        let user = req.user;
        let placeId = req.params.id;
        if (user && user.departments && user.departments.length > 0) {
            let allowed = await Department.count({
                client: user._id,
                place: placeId
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
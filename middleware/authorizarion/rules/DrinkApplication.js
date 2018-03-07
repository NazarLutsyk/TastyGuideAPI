let DrinkApplication = require(global.paths.MODELS + '/DrinkApplication');
module.exports = {
    async updateDrinkApplication(req,res,next) {
        let user = req.user;
        let appId = req.params.id;
        if (user) {
            let allowed = await DrinkApplication.count({_id : appId, organizer : user._id});
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
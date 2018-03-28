let DrinkApplication = require(global.paths.MODELS + '/DrinkApplication');
module.exports = {
    async updateDrinkApplication(req,res,next) {
        try {
            let user = req.user;
            let drinkAppId = req.params.id;
            let drinkApp = await DrinkApplication.findById(drinkAppId);
            if (drinkApp && drinkApp.organizer.equals(user._id)) {
                next();
            } else {
                res.sendStatus(403);
            }
        } catch (e) {
            return res.status(400).send(e.toString());
        }
    }
};
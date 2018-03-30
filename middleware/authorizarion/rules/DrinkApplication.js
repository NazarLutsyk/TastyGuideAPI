let DrinkApplication = require('../../../models/DrinkApplication');
module.exports = {
    async updateDrinkApplication(req, res, next) {
        try {
            log('rule update DrinkApp');
            let user = req.user;
            let drinkAppId = req.params.id;
            let drinkApp = await DrinkApplication.findById(drinkAppId);
            if (drinkApp && drinkApp.organizer.equals(user._id)) {
                return next();
            } else {
                let error = new Error();
                error.message = 'Forbidden';
                error.status = 403;
                return next(error);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    }
};

let Rating = require('../../../models/Rating');
module.exports = {
    async updateRating(req,res,next) {
        try {
            let user = req.user;
            let ratingId = req.params.id;
            let rating = await Rating.findById(ratingId);
            if (rating && rating.client.equals(user._id)) {
                return next();
            } else {
                let error = new Error();
                error.status = 403;
                error.message = 'Forbidden';
                return next(error);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    }
};
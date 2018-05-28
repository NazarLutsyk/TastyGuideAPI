let Review = require("../models/Review");

module.exports = {
    async getReviews(req, res, next) {
        try {
            res.json(await Review.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    }
};
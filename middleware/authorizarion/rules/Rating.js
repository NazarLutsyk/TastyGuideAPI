let Client = require(global.paths.MODELS + '/Client');
let Rating = require(global.paths.MODELS + '/Rating');
module.exports = {
    async updateRating(req,res,next) {
        try {
            let user = req.user;
            let ratingId = req.params.id;
            let rating = await Rating.findById(ratingId);
            if (rating && rating.client.equals(user._id)) {
                next();
            } else {
                res.sendStatus(403);
            }
        } catch (e) {
            return res.status(400).send(e.toString());
        }
    }
};
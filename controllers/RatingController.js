let Rating = require('../models/Rating');
let keysValidator = require('../validators/keysValidator');

module.exports = {
    async getRatings(req, res, next) {
        try {
            res.json(await Rating.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getRatingById(req, res, next) {
        let ratingId = req.params.id;
        try {
            req.query.target.query._id = ratingId;
            res.json(await Rating.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createRating(req, res, next) {
        try {
            let err = keysValidator.diff(Rating.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                req.body.client = req.user._id;
                let rating = new Rating(req.body);
                rating = await rating.supersave();
                res.status(201).json(rating);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async updateRating(req, res, next) {
        let ratingId = req.params.id;
        try {
            let err = keysValidator.diff(Rating.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let rating = await Rating.findById(ratingId);
                if (rating) {
                    let updated = await rating.superupdate(req.body);
                    res.status(201).json(updated);
                } else {
                    let e = new Error();
                    e.message = "Not found";
                    e.status = 404;
                    return next(e);
                }
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async removeRating(req, res, next) {
        let ratingId = req.params.id;
        try {
            let rating = await Rating.findById(ratingId);
            if (rating) {
                rating = await rating.remove();
                res.status(204).json(rating);
            } else {
                let e = new Error();
                e.message = "Not found";
                e.status = 404;
                return next(e);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    }
};
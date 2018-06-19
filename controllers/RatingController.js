let Rating = require('../models/Rating');
let keysValidator = require('../validators/keysValidator');
let mongoose = require("mongoose");

module.exports = {
    async getRatings(req, res, next) {
        try {
            if (JSON.stringify(req.query).search(/^[0-9a-fA-F]{24}$/)) {
                console.log('here');
                function iterate(obj, stack) {
                    for (let property in obj) {
                        if (obj.hasOwnProperty(property)) {
                            if (typeof obj[property] === "object") {
                                iterate(obj[property], stack + "." + property);
                            } else if (typeof obj[property] === "string" && obj[property].match(/^[0-9a-fA-F]{24}$/)) {
                                obj[property] = mongoose.Types.ObjectId(obj[property]);
                            }
                        }
                    }
                }

                iterate(req.query, "");
            }
            res.json(await Rating.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getRatingById(req, res, next) {
        let ratingId = req.params.id;
        try {
            req.query.query._id = ratingId;
            let rating = await Rating.superfind(req.query);
            res.json(rating[0]);
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
                rating = await rating.supersave(Rating);
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
                    let updated = await rating.superupdate(req.body,Rating);
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
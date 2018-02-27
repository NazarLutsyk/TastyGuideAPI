let Rating = require('../models/Rating');

module.exports = {
    async getRatings(req, res) {
        try {
            let ratingQuery = Rating
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    ratingQuery.populate(populateField);
                }
            }
            let ratings = await ratingQuery.exec();
            res.json(ratings);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async getRatingById(req, res) {
        let ratingId = req.params.id;
        try {
            let ratingQuery = Rating.find({_id: ratingId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    ratingQuery.populate(populateField);
                }
            }
            let rating = await ratingQuery.exec();
            res.json(rating);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async createRating(req, res) {
        try {
            let rating = await Rating.create(req.body);
            res.status(201).json(rating);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updateRating(req, res) {
        let ratingId = req.params.id;
        try {
            let rating = await Rating.findByIdAndUpdate(ratingId, req.body,{new : true});
            res.status(201).json(rating);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeRating(req, res) {
        let ratingId = req.params.id;
        try {
            let rating = await Rating.findById(ratingId);
            rating = await rating.remove();
            res.status(204).json(rating);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};
let Rating = require('../models/Rating');

module.exports = {
    async getRatings(req, res) {
        try {
            let ratings = await Rating.find({});
            res.json(ratings);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async getRatingById(req, res) {
        let ratingId = req.params.id;
        try {
            let rating = await Rating.findById(ratingId);
            res.json(rating);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async createRating(req, res) {
        try {
            let rating = await Rating.create(req.body);
            res.json(rating);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async updateRating(req, res) {
        let ratingId = req.params.id;
        try {
            let rating = await Rating.findByIdAndUpdate(ratingId, req.body,{new : true});
            res.json(rating);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async removeRating(req, res) {
        let ratingId = req.params.id;
        try {
            let rating = await Rating.findById(ratingId);
            rating = await rating.remove();
            res.json(rating);
        } catch (e) {
            res.send(e.toString());
        }
    }
};
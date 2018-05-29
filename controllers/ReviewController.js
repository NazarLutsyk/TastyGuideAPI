let Review = require("../models/Review");
let mongoose = require("mongoose");

module.exports = {
    async getReviews(req, res, next) {
        try {
            let count = 0;
            let requestQuery = req.query.query;
            if (requestQuery.place) {
                let query = {
                    place: new mongoose.Types.ObjectId(requestQuery.place),
                };
                if (requestQuery.start && requestQuery.end) {
                    query.createdAt = {
                        $gte: new Date(requestQuery.start),
                        $lte: new Date(requestQuery.end),
                    };
                }
                console.log(query);
                count = await Review.aggregate([
                    {
                        $match: query,
                    },
                    {
                        $group: {
                            _id: "_id",
                            count: {$sum: 1}
                        }
                    }
                ]);
                count = count[0] ? count[0].count : 0;
            }
            res.json({
                count
            });
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    }
};
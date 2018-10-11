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
    },

    async getManyReviews(req, res, next) {
        try {
            let count = 0;
            let requestQuery = req.query.query;
            if (requestQuery.places) {
                if (JSON.stringify(req.query).search(/^[0-9a-fA-F]{24}$/)) {
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
                    iterate(requestQuery, "");
                }

                let query = {};

                if (requestQuery.places && requestQuery.places.length > 0){
                    query.place = {$in: requestQuery.places};
                }
                if (requestQuery.start && requestQuery.end) {
                    query.createdAt = {
                        $gte: new Date(requestQuery.start),
                        $lte: new Date(requestQuery.end),
                    };
                }
                count = await Review.aggregate([
                    {
                        $match: query,
                    },
                    {
                        $group: {
                            _id: "$place",
                            count: {$sum: 1}
                        }
                    }
                ]);
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
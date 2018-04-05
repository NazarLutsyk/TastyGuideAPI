let TopPlace = require('../models/TopPlace');
let keysValidator = require('../validators/keysValidator');

module.exports = {
    async getTopPlaces(req, res, next) {
        try {
            res.json(await TopPlace.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getTopPlaceById(req, res, next) {
        let topPlaceId = req.params.id;
        try {
            req.query.target.query._id = topPlaceId;
            res.json(await TopPlace.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createTopPlace(req, res, next) {
        try {
            let err = keysValidator.diff(TopPlace.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let topPlace = new TopPlace(req.body);
                topPlace = await topPlace.supersave();
                res.status(201).json(topPlace);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async updateTopPlace(req, res, next) {
        let topPlaceId = req.params.id;
        try {
            let err = keysValidator.diff(TopPlace.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let topPlace = await TopPlace.findById(topPlaceId);
                if (topPlace) {
                    let updated = await topPlace.superupdate(req.body);
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
    async removeTopPlace(req, res, next) {
        let topPlaceId = req.params.id;
        try {
            let topPlace = await TopPlace.findById(topPlaceId);
            if (topPlace) {
                topPlace = await topPlace.remove();
                res.status(204).json(topPlace);
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
let PlaceTypeMultilang = require('../models/PlaceTypeMultilang');
let keysValidator = require('../validators/keysValidator');

module.exports = {
    async getPlaceTypeMultilangs(req, res, next) {
        try {
            let placeTypeMultilangQuery;
            if (req.query.aggregate) {
                placeTypeMultilangQuery = PlaceTypeMultilang.aggregate(req.query.aggregate);
            } else {
                placeTypeMultilangQuery = PlaceTypeMultilang
                    .find(req.query.query)
                    .sort(req.query.sort)
                    .select(req.query.fields)
                    .skip(req.query.skip)
                    .limit(req.query.limit);
                if (req.query.populate) {
                    for (let populateField of req.query.populate) {
                        placeTypeMultilangQuery.populate(populateField);
                    }
                }
            }
            let placeTypeMultilangs = await placeTypeMultilangQuery.exec();
            res.json(placeTypeMultilangs);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getPlaceTypeMultilangById(req, res, next) {
        let placeTypeMultilangId = req.params.id;
        try {
            let placeTypeMultilangQuery = PlaceTypeMultilang.findOne({_id: placeTypeMultilangId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    placeTypeMultilangQuery.populate(populateField);
                }
            }
            let placeTypeMultilang = await placeTypeMultilangQuery.exec();
            res.json(placeTypeMultilang);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createPlaceTypeMultilang(req, res, next) {
        try {
            let err = keysValidator.diff(PlaceTypeMultilang.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let placeTypeMultilang = new PlaceTypeMultilang(req.body);
                placeTypeMultilang = await placeTypeMultilang.supersave();
                res.status(201).json(placeTypeMultilang);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async updatePlaceTypeMultilang(req, res, next) {
        let placeTypeMultilangId = req.params.id;
        try {
            let err = keysValidator.diff(PlaceTypeMultilang.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let placeTypeMultilang = await PlaceTypeMultilang.findById(placeTypeMultilangId);
                if (placeTypeMultilang) {
                    let updated = await placeTypeMultilang.superupdate(req.body);
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
    async removePlaceTypeMultilang(req, res, next) {
        let placeTypeMultilangId = req.params.id;
        try {
            let placeTypeMultilang = await PlaceTypeMultilang.findById(placeTypeMultilangId);
            if (placeTypeMultilang) {
                placeTypeMultilang = await placeTypeMultilang.remove();
                res.status(204).json(placeTypeMultilang);
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
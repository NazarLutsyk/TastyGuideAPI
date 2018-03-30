let PlaceMultilang = require('../models/PlaceMultilang');
let keysValidator = require('../validators/keysValidator');

module.exports = {
    async getPlaceMultilangs(req, res, next) {
        try {
            let placeMultilangQuery;
            if (req.query.aggregate) {
                placeMultilangQuery = PlaceMultilang.aggregate(req.query.aggregate);
            } else {
                placeMultilangQuery = PlaceMultilang
                    .find(req.query.query)
                    .sort(req.query.sort)
                    .select(req.query.fields)
                    .skip(req.query.skip)
                    .limit(req.query.limit);
                if (req.query.populate) {
                    for (let populateField of req.query.populate) {
                        placeMultilangQuery.populate(populateField);
                    }
                }
            }
            let placeMultilangs = await placeMultilangQuery.exec();
            res.json(placeMultilangs);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getPlaceMultilangById(req, res, next) {
        let placeMultilangId = req.params.id;
        try {
            let placeMultilangQuery = PlaceMultilang.findOne({_id: placeMultilangId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    placeMultilangQuery.populate(populateField);
                }
            }
            let placeMultilang = await placeMultilangQuery.exec();
            res.json(placeMultilang);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createPlaceMultilang(req, res, next) {
        try {
            let err = keysValidator.diff(PlaceMultilang.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let placeMultilang = new PlaceMultilang(req.body);
                placeMultilang = await placeMultilang.supersave();
                res.status(201).json(placeMultilang);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async updatePlaceMultilang(req, res, next) {
        let placeMultilangId = req.params.id;
        try {
            let err = keysValidator.diff(PlaceMultilang.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let placeMultilang = await PlaceMultilang.findById(placeMultilangId);
                if (placeMultilang) {
                    let updated = await placeMultilang.superupdate(req.body);
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
    async removePlaceMultilang(req, res, next) {
        let placeMultilangId = req.params.id;
        try {
            let placeMultilang = await PlaceMultilang.findById(placeMultilangId);
            if (placeMultilang) {
                placeMultilang = await placeMultilang.remove();
                res.status(204).json(placeMultilang);
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
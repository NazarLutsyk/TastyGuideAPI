let PlaceType = require('../models/PlaceType');
let keysValidator = require('../validators/keysValidator');
let objectHelper = require('../helpers/objectHelper');

module.exports = {
    async getPlaceTypes(req, res, next) {
        try {
            let placeTypeQuery;
            if (req.query.aggregate) {
                placeTypeQuery = PlaceType.aggregate(req.query.aggregate);
            } else {
                placeTypeQuery = PlaceType
                    .find(req.query.query)
                    .sort(req.query.sort)
                    .select(req.query.fields)
                    .skip(req.query.skip)
                    .limit(req.query.limit);
                if (req.query.populate) {
                    for (let populateField of req.query.populate) {
                        placeTypeQuery.populate(populateField);
                    }
                }
            }
            let placeTypes = await placeTypeQuery.exec();
            res.json(placeTypes);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getPlaceTypeById(req, res, next) {
        let placeTypeId = req.params.id;
        try {
            let placeTypeQuery = PlaceType.findOne({_id: placeTypeId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    placeTypeQuery.populate(populateField);
                }
            }
            let placeType = await placeTypeQuery.exec();
            res.json(placeType);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createPlaceType(req, res, next) {
        try {
            let err = keysValidator.diff(PlaceType.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let placeType = new PlaceType(req.body);
                placeType = await placeType.supersave();
                res.status(201).json(placeType);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async updatePlaceType(req, res, next) {
        let placeTypeId = req.params.id;
        try {
            let err = keysValidator.diff(PlaceType.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let placeType = await PlaceType.findById(placeTypeId);
                if (placeType) {
                    let updated = await placeType.superupdate(req.body);
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
    async removePlaceType(req, res, next) {
        let placeTypeId = req.params.id;
        try {
            let placeType = await PlaceType.findById(placeTypeId);
            if (placeType) {
                placeType = await placeType.remove();
                res.status(204).json(placeType);
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
    },
};
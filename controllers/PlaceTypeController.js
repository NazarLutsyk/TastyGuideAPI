let PlaceType = require('../models/PlaceType');
let keysValidator = require('../validators/keysValidator');
let objectHelper = require('../helpers/objectHelper');

module.exports = {
    async getPlaceTypes(req, res, next) {
        try {
            res.json(await PlaceType.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getPlaceTypeById(req, res, next) {
        let placeTypeId = req.params.id;
        try {
            req.query.query._id = placeTypeId;
            let placeType = await PlaceType.superfind(req.query);
            res.json(placeType[0]);
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
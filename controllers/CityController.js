let City = require('../models/City');
let keysValidator = require('../validators/keysValidator');
let objectHelper = require('../helpers/objectHelper');

module.exports = {
    async getCities(req, res, next) {
        try {
            res.json(await City.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getCityById(req, res, next) {
        let cityId = req.params.id;
        try {
            req.query.query._id = cityId;
            let city = await City.superfind(req.query);
            res.json(city[0]);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createCity(req, res, next) {
        try {
            let err = keysValidator.diff(City.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let city = new City(req.body);
                city = await city.supersave();
                res.status(201).json(city);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async updateCity(req, res, next) {
        let cityId = req.params.id;
        try {
            let err = keysValidator.diff(City.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let city = await City.findById(cityId);
                if (city) {
                    let updated = await city.superupdate(req.body);
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
    async removeCity(req, res, next) {
        let cityId = req.params.id;
        try {
            let city = await City.findById(cityId);
            if (city) {
                city = await city.remove();
                res.status(204).json(city);
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
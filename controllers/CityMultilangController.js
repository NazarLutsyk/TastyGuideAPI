let CityMultilang = require('../models/CityMultilang');
let keysValidator = require('../validators/keysValidator');

module.exports = {
    async getCityMultilangs(req, res, next) {
        try {
            res.json(await CityMultilang.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getCityMultilangById(req, res, next) {
        let cityMultilangId = req.params.id;
        try {
            req.query.query._id = cityMultilangId;
            let cityMultilang = await CityMultilang.superfind(req.query);
            res.json(cityMultilang[0]);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createCityMultilang(req, res, next) {
        try {
            let err = keysValidator.diff(CityMultilang.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let cityMultilang = new CityMultilang(req.body);
                cityMultilang = await cityMultilang.supersave();
                res.status(201).json(cityMultilang);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async updateCityMultilang(req, res, next) {
        let cityMultilangId = req.params.id;
        try {
            let err = keysValidator.diff(CityMultilang.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let cityMultilang = await CityMultilang.findById(cityMultilangId);
                if (cityMultilang) {
                    let updated = await cityMultilang.superupdate(req.body);
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
    async removeCityMultilang(req, res, next) {
        let cityMultilangId = req.params.id;
        try {
            let cityMultilang = await CityMultilang.findById(cityMultilangId);
            if (cityMultilang) {
                cityMultilang = await cityMultilang.remove();
                res.status(204).json(cityMultilang);
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
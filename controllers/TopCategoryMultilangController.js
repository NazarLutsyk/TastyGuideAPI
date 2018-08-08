let TopCategotyMultilang = require('../models/TopCategoryMultilang');
let keysValidator = require('../validators/keysValidator');

module.exports = {
    async getTopCategoryMultilang(req, res, next) {
        try {
            res.json(await TopCategotyMultilang.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getTopCategoryMultilangById(req, res, next) {
        let topCategoryMultilangId = req.params.id;
        try {
            req.query.query._id = topCategoryMultilangId;
            let topCategoryMultilang = await TopCategotyMultilang.superfind(req.query);
            res.json(topCategoryMultilang[0]);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createTopCategoryMultilang(req, res, next) {
        try {
            let err = keysValidator.diff(TopCategotyMultilang.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let topCategoryMultilang = new TopCategotyMultilang(req.body);
                topCategoryMultilang = await topCategoryMultilang.supersave();
                res.status(201).json(topCategoryMultilang);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async updateTopCategoryMultilang(req, res, next) {
        let topCategoryMultilangId = req.params.id;
        try {
            let err = keysValidator.diff(TopCategotyMultilang.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let topCategoryMultilang = await TopCategotyMultilang.findById(topCategoryMultilangId);
                if (topCategoryMultilang) {
                    let updated = await topCategoryMultilang.superupdate(req.body);
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
    async removeTopCategoryMultilang(req, res, next) {
        let topCategoryMultilangId = req.params.id;
        try {
            let topCategoryMultilang = await TopCategotyMultilang.findById(topCategoryMultilangId);
            if (topCategoryMultilang) {
                topCategoryMultilang = await topCategoryMultilang.remove();
                res.status(204).json(topCategoryMultilang);
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
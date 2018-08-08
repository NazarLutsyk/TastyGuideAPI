let TopCategory = require('../models/TopCategory');
let keysValidator = require('../validators/keysValidator');
let objectHelper = require('../helpers/objectHelper');

module.exports = {
    async getTopCategories(req, res, next) {
        try {
            res.json(await TopCategory.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getTopCategoryById(req, res, next) {
        let topCategoryId = req.params.id;
        try {
            req.query.query._id = topCategoryId;
            let topCategory = await TopCategory.superfind(req.query);
            res.json(topCategory[0]);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createTopCategory(req, res, next) {
        try {
            let err = keysValidator.diff(TopCategory.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let topCategory = new TopCategory(req.body);
                topCategory = await topCategory.supersave();
                res.status(201).json(topCategory);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async updateTopCategory(req, res, next) {
        let topCategoryId = req.params.id;
        try {
            let err = keysValidator.diff(TopCategory.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let topCategory = await TopCategory.findById(topCategoryId);
                if (topCategory) {
                    let updated = await topCategory.superupdate(req.body);
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
    async removeTopCategory(req, res, next) {
        let topCategoryId = req.params.id;
        try {
            let topCategory = await TopCategory.findById(topCategoryId);
            if (topCategory) {
                topCategory = await topCategory.remove();
                res.status(204).json(topCategory);
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
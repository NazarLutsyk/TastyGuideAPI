let Kitchen = require('../models/Kitchen');
let keysValidator = require('../validators/keysValidator');
let objectHelper = require('../helpers/objectHelper');

module.exports = {
    async getKitchens(req, res, next) {
        try {
            res.json(await Kitchen.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getKitchenById(req, res, next) {
        let kitchenId = req.params.id;
        try {
            req.query.query._id = kitchenId;
            let kitchen = await Kitchen.superfind(req.query);
            res.json(kitchen[0]);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createKitchen(req, res, next) {
        try {
            let err = keysValidator.diff(Kitchen.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let kitchen = new Kitchen(req.body);
                kitchen = await kitchen.supersave();
                res.status(201).json(kitchen);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async updateKitchen(req, res, next) {
        let kitchenId = req.params.id;
        try {
            let err = keysValidator.diff(Kitchen.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let kitchen = await Kitchen.findById(kitchenId);
                if (kitchen) {
                    let updated = await kitchen.superupdate(req.body);
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
    async removeKitchen(req, res, next) {
        let kitchenId = req.params.id;
        try {
            let kitchen = await Kitchen.findById(kitchenId);
            if (kitchen) {
                kitchen = await kitchen.remove();
                res.status(204).json(kitchen);
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
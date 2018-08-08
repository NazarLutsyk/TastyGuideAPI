let KitchenMultilang = require('../models/KitchenMultilang');
let keysValidator = require('../validators/keysValidator');

module.exports = {
    async getKitchenMultilangs(req, res, next) {
        try {
            res.json(await KitchenMultilang.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getKitchenMultilangById(req, res, next) {
        let kitchenMultilangId = req.params.id;
        try {
            req.query.query._id = kitchenMultilangId;
            let kitchenMultilang = await KitchenMultilang.superfind(req.query);
            res.json(kitchenMultilang[0]);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createKitchenMultilang(req, res, next) {
        try {
            let err = keysValidator.diff(KitchenMultilang.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let kitchenMultilang = new KitchenMultilang(req.body);
                kitchenMultilang = await kitchenMultilang.supersave();
                res.status(201).json(kitchenMultilang);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async updateKitchenMultilang(req, res, next) {
        let kitchenMultilangId = req.params.id;
        try {
            let err = keysValidator.diff(KitchenMultilang.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let kitchenMultilang = await KitchenMultilang.findById(kitchenMultilangId);
                if (kitchenMultilang) {
                    let updated = await kitchenMultilang.superupdate(req.body);
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
    async removeKitchenMultilang(req, res, next) {
        let kitchenMultilangId = req.params.id;
        try {
            let kitchenMultilang = await KitchenMultilang.findById(kitchenMultilangId);
            if (kitchenMultilang) {
                kitchenMultilang = await kitchenMultilang.remove();
                res.status(204).json(kitchenMultilang);
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
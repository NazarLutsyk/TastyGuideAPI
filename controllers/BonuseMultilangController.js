let BonuseMultilang = require('../models/BonuseMultilang');
let keysValidator = require('../validators/keysValidator');

module.exports = {
    async getBonuseMultilangs(req, res,next) {
        try {
            let bonuseMultilangQuery;
            if (req.query.aggregate) {
                bonuseMultilangQuery = BonuseMultilang.aggregate(req.query.aggregate);
            } else {
                bonuseMultilangQuery = BonuseMultilang
                    .find(req.query.query)
                    .sort(req.query.sort)
                    .select(req.query.fields)
                    .skip(req.query.skip)
                    .limit(req.query.limit);
                if (req.query.populate) {
                    for (let populateField of req.query.populate) {
                        bonuseMultilangQuery.populate(populateField);
                    }
                }
            }
            let bonuseMultilang = await bonuseMultilangQuery.exec();
            res.json(bonuseMultilang);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getBonuseMultilangById(req, res,next) {
        let bonuseMultilangId = req.params.id;
        try {
            let bonuseMultilangQuery = BonuseMultilang.findOne({_id: bonuseMultilangId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    bonuseMultilangQuery.populate(populateField);
                }
            }
            let bonuseMultilang = await bonuseMultilangQuery.exec();
            res.json(bonuseMultilang);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createBonuseMultilang(req, res,next) {
        try {
            let err = keysValidator.diff(BonuseMultilang.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let bonuseMultilang = new BonuseMultilang(req.body);
                bonuseMultilang = await bonuseMultilang.supersave();
                res.status(201).json(bonuseMultilang);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async updateBonuseMultilang(req, res,next) {
        let bonuseMultilangId = req.params.id;
        try {
            let err = keysValidator.diff(BonuseMultilang.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let bonuseMultilang = await BonuseMultilang.findById(bonuseMultilangId);
                if (bonuseMultilang) {
                    let updated = await bonuseMultilang.superupdate(req.body);
                    res.status(201).json(updated);
                } else {
                    let e = new Error();
                    e.status = 404;
                    e.message = 'Not found';
                    return next(e);
                }
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async removeImage(req, res,next) {
        let bonuseMultilangId = req.params.id;
        try {
            let bonuseMultilang = await BonuseMultilang.findById(bonuseMultilangId);
            if (bonuseMultilang) {
                bonuseMultilang = await bonuseMultilang.remove();
                res.status(204).json(bonuseMultilang);
            } else {
                let e = new Error();
                e.status = 404;
                e.message = 'Not found';
                return next(e);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    }
};
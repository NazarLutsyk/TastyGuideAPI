let BonuseMultilang = require(global.paths.MODELS + '/BonuseMultilang');
let keysValidator = require(global.paths.VALIDATORS + '/keysValidator');
let objectHelper = require(global.paths.HELPERS + '/objectHelper');

module.exports = {
    async getBonuseMultilangs(req, res) {
        try {
            let bonuseMultilangQuery = BonuseMultilang
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    bonuseMultilangQuery.populate(populateField);
                }
            }
            let bonuseMultilang = await bonuseMultilangQuery.exec();
            res.json(bonuseMultilang);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async getBonuseMultilangById(req, res) {
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
            res.status(400).send(e.toString());
        }
    },
    async createBonuseMultilang(req, res) {
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
            res.status(400).send(e.toString());
        }
    },
    async updateBonuseMultilang(req, res) {
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
                    res.sendStatus(404);
                }
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeImage(req, res) {
        let bonuseMultilangId = req.params.id;
        try {
            let bonuseMultilang = await BonuseMultilang.findById(bonuseMultilangId);
            if(bonuseMultilang) {
                bonuseMultilang = await bonuseMultilang.remove();
                res.status(204).json(bonuseMultilang);
            }else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};
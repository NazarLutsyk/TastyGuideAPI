let BonuseMultilang = require('../models/BonuseMultilang');

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
            res.send(e.toString());
        }
    },
    async getBonuseMultilangById(req, res) {
        let bonuseMultilangId = req.params.id;
        try {
            let bonuseMultilangQuery = BonuseMultilang.find({_id: bonuseMultilangId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    bonuseMultilangQuery.populate(populateField);
                }
            }
            let bonuseMultilang = await bonuseMultilangQuery.exec();
            res.json(bonuseMultilang);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async createBonuseMultilang(req, res) {
        try {
            let bonuseMultilang = await BonuseMultilang.create(req.body);
            res.json(bonuseMultilang);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async updateBonuseMultilang(req, res) {
        let bonuseMultilangId = req.params.id;
        try {
            let bonuseMultilang = await BonuseMultilang.findByIdAndUpdate(bonuseMultilangId, req.body,{new : true});
            res.json(bonuseMultilang);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async removeBonuseMultilang(req, res) {
        let bonuseMultilangId = req.params.id;
        try {
            let bonuseMultilang = await BonuseMultilang.findById(bonuseMultilangId);
            bonuseMultilang = await bonuseMultilang.remove();
            res.json(bonuseMultilang);
        } catch (e) {
            res.send(e.toString());
        }
    }
};
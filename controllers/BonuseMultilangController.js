let BonuseMultilang = require('../models/BonuseMultilang');

module.exports = {
    async getBonuseMultilangs(req, res) {
        try {
            let bonuseMultilangs = await BonuseMultilang.find({});
            res.json(bonuseMultilangs);
        } catch (e) {
            res.json(e);
        }
    },
    async getBonuseMultilangById(req, res) {
        let bonuseMultilangId = req.params.id;
        try {
            let bonuseMultilang = await BonuseMultilang.findById(bonuseMultilangId);
            res.json(bonuseMultilang);
        } catch (e) {
            res.json(e);
        }
    },
    async createBonuseMultilang(req, res) {
        try {
            let bonuseMultilang = await BonuseMultilang.create(req.body);
            res.json(bonuseMultilang);
        } catch (e) {
            res.json(e);
        }
    },
    async updateBonuseMultilang(req, res) {
        let bonuseMultilangId = req.params.id;
        try {
            let bonuseMultilang = await BonuseMultilang.findByIdAndUpdate(bonuseMultilangId, req.body,{new : true});
            res.json(bonuseMultilang);
        } catch (e) {
            res.json(e);
        }
    },
    async removeBonuseMultilang(req, res) {
        let bonuseMultilangId = req.params.id;
        try {
            let bonuseMultilang = await BonuseMultilang.findById(bonuseMultilangId);
            bonuseMultilang = await bonuseMultilang.remove();
            res.json(bonuseMultilang);
        } catch (e) {
            res.json(e);
        }
    }
};
let Bonuse = require('../models/Bonuse');

module.exports = {
    async getBonuses(req, res) {
        try {
            let bonuses = await Bonuse.find({});
            res.json(bonuses);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async getBonuseById(req, res) {
        let bonuseId = req.params.id;
        try {
            let bonuse = await Bonuse.findById(bonuseId);
            res.json(bonuse);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async createBonuse(req, res) {
        try {
            let bonuse = await Bonuse.create(req.body);
            res.json(bonuse);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async updateBonuse(req, res) {
        let bonuseId = req.params.id;
        try {
            let bonuse = await Bonuse.findByIdAndUpdate(bonuseId, req.body,{new : true});
            res.json(bonuse);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async removeBonuse(req, res) {
        let bonuseId = req.params.id;
        try {
            let bonuse = await Bonuse.findById(bonuseId);
            bonuse = await bonuse.remove();
            res.json(bonuse);
        } catch (e) {
            res.send(e.toString());
        }
    }
};
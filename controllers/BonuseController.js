let Bonuse = require('../models/Bonuse');

module.exports = {
    async getBonuses(req, res) {
        try {
            let bonuseQuery = Bonuse
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    bonuseQuery.populate(populateField);
                }
            }
            let bonuses = await bonuseQuery.exec();
            res.json(bonuses);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async getBonuseById(req, res) {
        let bonuseId = req.params.id;
        try {
            let bonuseQuery = Bonuse.find({_id: bonuseId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    bonuseQuery.populate(populateField);
                }
            }
            let bonuse = await bonuseQuery.exec();
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
            let bonuse = await Bonuse.findByIdAndUpdate(bonuseId, req.body, {new: true});
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
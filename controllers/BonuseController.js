let Bonuse = require('../models/Bonuse');
let relationHelper = require('../helpers/relationHelper');
let path = require('path');

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
            res.status(404).send(e.toString());
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
            res.status(404).send(e.toString());
        }
    },
    async createBonuse(req, res) {
        try {
            let bonuse = await Bonuse.create(req.body);
            res.status(201).json(bonuse);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updateBonuse(req, res) {
        let bonuseId = req.params.id;
        try {
            let updatedBonuse = await Bonuse.findByIdAndUpdate(bonuseId, req.body, {new: true});
            res.status(201).json(updatedBonuse);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeBonuse(req, res) {
        let bonuseId = req.params.id;
        try {
            let bonuse = await Bonuse.findById(bonuseId);
            bonuse = await bonuse.remove();
            res.status(204).json(bonuse);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async addMultilang(req, res) {
        let modelId = req.params.id;
        let multilangId = req.params.idMultilang;
        try {
            if (modelId && multilangId) {
                await relationHelper.addRelation
                ('Bonuse', 'BonuseMultilang', modelId, multilangId, 'multilang', 'bonuse');
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeMultilang(req, res) {
        let modelId = req.params.id;
        let multilangId = req.params.idMultilang;
        try {
            if (modelId && multilangId) {
                await relationHelper.removeRelation
                ('Bonuse', 'BonuseMultilang', modelId, multilangId, 'multilang', 'bonuse');
                res.sendStatus(204);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};
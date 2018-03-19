let Bonuse = require(global.paths.MODELS + '/Bonuse');
let path = require('path');
let keysValidator = require(global.paths.VALIDATORS + '/keysValidator');

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
            res.status(400).send(e.toString());
        }
    },
    async getBonuseById(req, res) {
        let bonuseId = req.params.id;
        try {
            let bonuseQuery = Bonuse.findOne({_id: bonuseId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    bonuseQuery.populate(populateField);
                }
            }
            let bonuse = await bonuseQuery.exec();
            res.json(bonuse);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async createBonuse(req, res) {
        try {
            let err = keysValidator.diff(Bonuse.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let bonuse = new Bonuse(req.body);
                bonuse = await bonuse.supersave(Bonuse);
                res.status(201).json(bonuse);
            }
        } catch (e) {
            console.log(e);
            res.status(400).send(e.toString());
        }
    },
    async updateBonuse(req, res) {
        let bonuseId = req.params.id;
        try {
            let err = keysValidator.diff(Bonuse.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let bonuse = await Bonuse.findById(bonuseId);
                if (bonuse) {
                    let updated = await bonuse.superupdate(Bonuse,req.body);
                    res.status(201).json(updated);
                } else {
                    res.sendStatus(404);
                }
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeBonuse(req, res) {
        let bonuseId = req.params.id;
        try {
            let bonuse = await Bonuse.findById(bonuseId);
            if (bonuse) {
                bonuse = await bonuse.remove();
                res.status(204).json(bonuse);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async addMultilang(req, res) {
        let modelId = req.params.id;
        let multilangId = req.params.idMultilang;
        try {
            if (modelId && multilangId) {
                let bonuse = await Bonuse.findById(modelId);
                await bonuse.superupdate(Bonuse,{
                    multilang : bonuse.multilang.concat(multilangId)
                });
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
                let bonuse = await Bonuse.findById(modelId);
                bonuse.multilang.splice(bonuse.multilang.indexOf(multilangId),1);
                await bonuse.superupdate(bonuse,{
                    multilang: bonuse.multilang
                });
                res.sendStatus(204);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};
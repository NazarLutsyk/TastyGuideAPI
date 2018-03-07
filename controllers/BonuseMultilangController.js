let BonuseMultilang = require(global.paths.MODELS + '/BonuseMultilang');

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
            res.status(404).send(e.toString());
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
            res.status(404).send(e.toString());
        }
    },
    async createBonuseMultilang(req, res) {
        try {
            let bonuseMultilang = await BonuseMultilang.create(req.body);
            res.status(201).json(bonuseMultilang);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updateBonuseMultilang(req, res) {
        let bonuseMultilangId = req.params.id;
        try {
            let bonuseMultilang = await BonuseMultilang.findByIdAndUpdate(bonuseMultilangId, req.body,{new : true});
            res.status(201).json(bonuseMultilang);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeImage(req, res) {
        let bonuseMultilangId = req.params.id;
        try {
            let bonuseMultilang = await BonuseMultilang.findById(bonuseMultilangId);
            bonuseMultilang = await bonuseMultilang.remove();
            res.status(204).json(bonuseMultilang);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};
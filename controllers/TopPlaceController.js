let TopPlace = require(global.paths.MODELS + '/TopPlace');
let keysValidator = require(global.paths.VALIDATORS + '/keysValidator');

module.exports = {
    async getTopPlaces(req, res) {
        try {
            let topPlaceQuery = TopPlace
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    topPlaceQuery.populate(populateField);
                }
            }
            let topPlaces = await topPlaceQuery.exec();
            res.json(topPlaces);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async getTopPlaceById(req, res) {
        let topPlaceId = req.params.id;
        try {
            let topPlaceQuery = TopPlace.findOne({_id: topPlaceId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    topPlaceQuery.populate(populateField);
                }
            }
            let topPlace = await topPlaceQuery.exec();
            res.json(topPlace);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async createTopPlace(req, res) {
        try {
            let err = keysValidator.diff(TopPlace.schema.tree, req.body);
            if (err){
                throw new Error('Unknown fields ' + err);
            } else {
                let topPlace = new TopPlace(req.body);
                topPlace = await topPlace.supersave();
                res.status(201).json(topPlace);
            }
        } catch (e) {
            console.log(e);
            res.status(400).send(e.toString());
        }
    },
    async updateTopPlace(req, res) {
        let topPlaceId = req.params.id;
        try {
            let err = keysValidator.diff(TopPlace.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let topPlace = await TopPlace.findById(topPlaceId);
                if (topPlace) {
                    let updated = await topPlace.superupdate(req.body);
                    res.status(201).json(updated);
                }else {
                    res.sendStatus(404);
                }
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeTopPlace(req, res) {
        let topPlaceId = req.params.id;
        try {
            let topPlace = await TopPlace.findById(topPlaceId);
            if (topPlace) {
                topPlace = await topPlace.remove();
                res.status(204).json(topPlace);
            }else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};
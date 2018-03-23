let PlaceMultilang = require(global.paths.MODELS + '/PlaceMultilang');
let keysValidator = require(global.paths.VALIDATORS + '/keysValidator');

module.exports = {
    async getPlaceMultilangs(req, res) {
        try {
            let placeMultilangQuery = PlaceMultilang
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields)
                .skip(req.query.skip)
                .limit(req.query.limit);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    placeMultilangQuery.populate(populateField);
                }
            }
            let placeMultilangs = await placeMultilangQuery.exec();
            res.json(placeMultilangs);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async getPlaceMultilangById(req, res) {
        let placeMultilangId = req.params.id;
        try {
            let placeMultilangQuery = PlaceMultilang.findOne({_id: placeMultilangId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    placeMultilangQuery.populate(populateField);
                }
            }
            let placeMultilang = await placeMultilangQuery.exec();
            res.json(placeMultilang);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async createPlaceMultilang(req, res) {
        try {
            let err = keysValidator.diff(PlaceMultilang.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let placeMultilang = new PlaceMultilang(req.body);
                placeMultilang = await placeMultilang.supersave();
                res.status(201).json(placeMultilang);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updatePlaceMultilang(req, res) {
        let placeMultilangId = req.params.id;
        try {
            let err = keysValidator.diff(PlaceMultilang.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let placeMultilang = await PlaceMultilang.findById(placeMultilangId);
                if (placeMultilang) {
                    let updated = await placeMultilang.superupdate(req.body);
                    res.status(201).json(updated);
                } else {
                    res.sendStatus(404);
                }
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removePlaceMultilang(req, res) {
        let placeMultilangId = req.params.id;
        try {
            let placeMultilang = await PlaceMultilang.findById(placeMultilangId);
            if (placeMultilang) {
                placeMultilang = await placeMultilang.remove();
                res.status(204).json(placeMultilang);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};
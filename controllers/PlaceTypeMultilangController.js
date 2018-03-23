let PlaceTypeMultilang = require(global.paths.MODELS + '/PlaceTypeMultilang');
let keysValidator = require(global.paths.VALIDATORS + '/keysValidator');

module.exports = {
    async getPlaceTypeMultilangs(req, res) {
        try {
            let placeTypeMultilangQuery = PlaceTypeMultilang
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields)
                .skip(req.query.skip)
                .limit(req.query.limit);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    placeTypeMultilangQuery.populate(populateField);
                }
            }
            let placeTypeMultilangs = await placeTypeMultilangQuery.exec();
            res.json(placeTypeMultilangs);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async getPlaceTypeMultilangById(req, res) {
        let placeTypeMultilangId = req.params.id;
        try {
            let placeTypeMultilangQuery = PlaceTypeMultilang.findOne({_id: placeTypeMultilangId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    placeTypeMultilangQuery.populate(populateField);
                }
            }
            let placeTypeMultilang = await placeTypeMultilangQuery.exec();
            res.json(placeTypeMultilang);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async createPlaceTypeMultilang(req, res) {
        try {
            let err = keysValidator.diff(PlaceTypeMultilang.schema.tree, req.body);
            if (err){
                throw new Error('Unknown fields ' + err);
            } else {
                let placeTypeMultilang = new PlaceTypeMultilang(req.body);
                placeTypeMultilang = await placeTypeMultilang.supersave();
                res.status(201).json(placeTypeMultilang);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updatePlaceTypeMultilang(req, res) {
        let placeTypeMultilangId = req.params.id;
        try {
            let err = keysValidator.diff(PlaceTypeMultilang.schema.tree, req.body);
            if (err){
                throw new Error('Unknown fields ' + err);
            } else {
                let placeTypeMultilang = await PlaceTypeMultilang.findById(placeTypeMultilangId);
                if (placeTypeMultilang) {
                    let updated = await placeTypeMultilang.superupdate(req.body);
                    res.status(201).json(updated);
                }else {
                    res.sendStatus(404);
                }
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removePlaceTypeMultilang(req, res) {
        let placeTypeMultilangId = req.params.id;
        try {
            let placeTypeMultilang = await PlaceTypeMultilang.findById(placeTypeMultilangId);
            if (placeTypeMultilang) {
                placeTypeMultilang = await placeTypeMultilang.remove();
                res.status(204).json(placeTypeMultilang);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};
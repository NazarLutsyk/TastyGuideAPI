let PlaceType = require(global.paths.MODELS + '/PlaceType');
let keysValidator = require(global.paths.VALIDATORS + '/keysValidator');
let objectHelper = require(global.paths.HELPERS + '/objectHelper');

module.exports = {
    async getPlaceTypes(req, res) {
        try {
            let placeTypeQuery;
            if (req.query.aggregate) {
                placeTypeQuery = PlaceType.aggregate(req.query.aggregate);
            } else {
                placeTypeQuery = PlaceType
                    .find(req.query.query)
                    .sort(req.query.sort)
                    .select(req.query.fields)
                    .skip(req.query.skip)
                    .limit(req.query.limit);
                if (req.query.populate) {
                    for (let populateField of req.query.populate) {
                        placeTypeQuery.populate(populateField);
                    }
                }
            }
            let placeTypes = await placeTypeQuery.exec();
            res.json(placeTypes);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async getPlaceTypeById(req, res) {
        let placeTypeId = req.params.id;
        try {
            let placeTypeQuery = PlaceType.findOne({_id: placeTypeId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    placeTypeQuery.populate(populateField);
                }
            }
            let placeType = await placeTypeQuery.exec();
            res.json(placeType);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async createPlaceType(req, res) {
        try {
            let err = keysValidator.diff(PlaceType.schema.tree, req.body);
            if (err){
                throw new Error('Unknown fields ' + err);
            } else {
                let placeType = await PlaceType.create(req.body);
                res.status(201).json(placeType);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updatePlaceType(req, res) {
        let placeTypeId = req.params.id;
        try {
            let err = keysValidator.diff(PlaceType.schema.tree, req.body);
            if (err){
                throw new Error('Unknown fields ' + err);
            } else {
                let placeType = await PlaceType.findById(placeTypeId);
                if (placeType) {
                    objectHelper.load(placeType, req.body);
                    let updated = await placeType.save();
                    res.status(201).json(updated);
                }else {
                    res.sendStatus(404);
                }
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removePlaceType(req, res) {
        let placeTypeId = req.params.id;
        try {
            let placeType = await PlaceType.findById(placeTypeId);
            if (placeType) {
                placeType = await placeType.remove();
                res.status(204).json(placeType);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
};
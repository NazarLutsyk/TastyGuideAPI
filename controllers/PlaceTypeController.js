let PlaceType = require('../models/PlaceType');

module.exports = {
    async getPlaceTypes(req, res) {
        try {
            let placeTypeQuery = PlaceType
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    placeTypeQuery.populate(populateField);
                }
            }
            let placeTypes = await placeTypeQuery.exec();
            res.json(placeTypes);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async getPlaceTypeById(req, res) {
        let placeTypeId = req.params.id;
        try {
            let placeTypeQuery = PlaceType.find({_id: placeTypeId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    placeTypeQuery.populate(populateField);
                }
            }
            let placeType = await placeTypeQuery.exec();
            res.json(placeType);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async createPlaceType(req, res) {
        try {
            let placeType = await PlaceType.create(req.body);
            res.status(201).json(placeType);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updatePlaceType(req, res) {
        let placeTypeId = req.params.id;
        try {
            let placeType = await PlaceType.findByIdAndUpdate(placeTypeId, req.body,{new : true});
            res.status(201).json(placeType);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removePlaceType(req, res) {
        let placeTypeId = req.params.id;
        try {
            let placeType = await PlaceType.findById(placeTypeId);
            placeType = await placeType.remove();
            res.status(204).json(placeType);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};
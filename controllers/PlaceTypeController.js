let PlaceType = require('../models/PlaceType');

module.exports = {
    async getPlaceTypes(req, res) {
        try {
            let placeTypes = await PlaceType.find({});
            res.json(placeTypes);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async getPlaceTypeById(req, res) {
        let placeTypeId = req.params.id;
        try {
            let placeType = await PlaceType.findById(placeTypeId).populate('multilang').exec();
            res.json(placeType);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async createPlaceType(req, res) {
        try {
            let placeType = await PlaceType.create(req.body);
            res.json(placeType);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async updatePlaceType(req, res) {
        let placeTypeId = req.params.id;
        try {
            let placeType = await PlaceType.findByIdAndUpdate(placeTypeId, req.body,{new : true});
            res.json(placeType);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async removePlaceType(req, res) {
        let placeTypeId = req.params.id;
        try {
            let placeType = await PlaceType.findById(placeTypeId);
            placeType = await placeType.remove();
            res.json(placeType);
        } catch (e) {
            res.send(e.toString());
        }
    }
};
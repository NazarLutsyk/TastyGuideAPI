let PlaceType = require('../models/PlaceType');

module.exports = {
    async getPlaceTypes(req, res) {
        try {
            let placeTypes = await PlaceType.find({});
            res.json(placeTypes);
        } catch (e) {
            res.json(e);
        }
    },
    async getPlaceTypeById(req, res) {
        let placeTypeId = req.params.id;
        try {
            let placeType = await PlaceType.findById(placeTypeId).populate('multilang').exec();
            res.json(placeType);
        } catch (e) {
            res.json(e);
        }
    },
    async createPlaceType(req, res) {
        try {
            let placeType = await PlaceType.create(req.body);
            res.json(placeType);
        } catch (e) {
            res.json(e);
        }
    },
    async updatePlaceType(req, res) {
        let placeTypeId = req.params.id;
        try {
            let placeType = await PlaceType.findByIdAndUpdate(placeTypeId, req.body,{new : true});
            res.json(placeType);
        } catch (e) {
            res.json(e);
        }
    },
    async removePlaceType(req, res) {
        let placeTypeId = req.params.id;
        try {
            let placeType = await PlaceType.findById(placeTypeId);
            placeType = await placeType.remove();
            res.json(placeType);
        } catch (e) {
            res.json(e);
        }
    }
};
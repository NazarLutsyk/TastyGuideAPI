let Place = require('../models/Place');

module.exports = {
    async getPlaces(req, res) {
        try {
            let places = await Place.find({});
            res.json(places);
        } catch (e) {
            res.json(e);
        }
    },
    async getPlaceById(req, res) {
        let placeId = req.params.id;
        try {
            let place = await Place.findById(placeId).populate();
            res.json(place);
        } catch (e) {
            res.json(e);
        }
    },
    async createPlace(req, res) {
        try {
            let place = await Place.create(req.body);
            res.json(place);
        } catch (e) {
            res.json(e);
        }
    },
    async updatePlace(req, res) {
        let placeId = req.params.id;
        try {
            let updatedPlace = await Place.findByIdAndUpdate(placeId, req.body,{new : true});
            res.json(updatedPlace);
        } catch (e) {
            res.json(e);
        }
    },
    async removePlace(req, res) {
        let placeId = req.params.id;
        try {
            let removedPlace = await Place.findById(placeId);
            removedPlace = await removedPlace.remove();
            res.json(removedPlace);
        } catch (e) {
            res.json(e);
        }
    }
};
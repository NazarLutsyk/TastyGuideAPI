let PlaceTypeMultilang = require('../models/PlaceTypeMultilang');

module.exports = {
    async getPlaceTypeMultilangs(req, res) {
        try {
            let placeTypeMultilangs = await PlaceTypeMultilang.find({});
            res.json(placeTypeMultilangs);
        } catch (e) {
            res.json(e);
        }
    },
    async getPlaceTypeMultilangById(req, res) {
        let placeTypeMultilangId = req.params.id;
        try {
            let placeTypeMultilang = await PlaceTypeMultilang.findById(placeTypeMultilangId);
            res.json(placeTypeMultilang);
        } catch (e) {
            res.json(e);
        }
    },
    async createPlaceTypeMultilang(req, res) {
        try {
            let placeTypeMultilang = await PlaceTypeMultilang.create(req.body);
            res.json(placeTypeMultilang);
        } catch (e) {
            res.json(e);
        }
    },
    async updatePlaceTypeMultilang(req, res) {
        let placeTypeMultilangId = req.params.id;
        try {
            let placeTypeMultilang = await PlaceTypeMultilang.findByIdAndUpdate(placeTypeMultilangId, req.body,{new : true});
            res.json(placeTypeMultilang);
        } catch (e) {
            res.json(e);
        }
    },
    async removePlaceTypeMultilang(req, res) {
        let placeTypeMultilangId = req.params.id;
        try {
            let placeTypeMultilang = await PlaceTypeMultilang.findById(placeTypeMultilangId);
            placeTypeMultilang = await placeTypeMultilang.remove();
            res.json(placeTypeMultilang);
        } catch (e) {
            res.json(e);
        }
    }
};
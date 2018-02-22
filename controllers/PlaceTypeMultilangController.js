let PlaceTypeMultilang = require('../models/PlaceTypeMultilang');

module.exports = {
    async getPlaceTypeMultilangs(req, res) {
        try {
            let placeTypeMultilangs = await PlaceTypeMultilang.find({});
            res.json(placeTypeMultilangs);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async getPlaceTypeMultilangById(req, res) {
        let placeTypeMultilangId = req.params.id;
        try {
            let placeTypeMultilang = await PlaceTypeMultilang.findById(placeTypeMultilangId);
            res.json(placeTypeMultilang);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async createPlaceTypeMultilang(req, res) {
        try {
            let placeTypeMultilang = await PlaceTypeMultilang.create(req.body);
            res.json(placeTypeMultilang);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async updatePlaceTypeMultilang(req, res) {
        let placeTypeMultilangId = req.params.id;
        try {
            let placeTypeMultilang = await PlaceTypeMultilang.findByIdAndUpdate(placeTypeMultilangId, req.body,{new : true});
            res.json(placeTypeMultilang);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async removePlaceTypeMultilang(req, res) {
        let placeTypeMultilangId = req.params.id;
        try {
            let placeTypeMultilang = await PlaceTypeMultilang.findById(placeTypeMultilangId);
            placeTypeMultilang = await placeTypeMultilang.remove();
            res.json(placeTypeMultilang);
        } catch (e) {
            res.send(e.toString());
        }
    }
};
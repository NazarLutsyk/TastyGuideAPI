let PlaceMultilang = require('../models/PlaceMultilang');

module.exports = {
    async getPlaceMultilangs(req, res) {
        try {
            let placeMultilangs = await PlaceMultilang.find({});
            res.json(placeMultilangs);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async getPlaceMultilangById(req, res) {
        let placeMultilangId = req.params.id;
        try {
            let placeMultilang = await PlaceMultilang.findById(placeMultilangId);
            res.json(placeMultilang);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async createPlaceMultilang(req, res) {
        try {
            let placeMultilang = await PlaceMultilang.create(req.body);
            res.json(placeMultilang);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async updatePlaceMultilang(req, res) {
        let placeMultilangId = req.params.id;
        try {
            let placeMultilang = await PlaceMultilang.findByIdAndUpdate(placeMultilangId, req.body,{new : true});
            res.json(placeMultilang);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async removePlaceMultilang(req, res) {
        let placeMultilangId = req.params.id;
        try {
            let placeMultilang = await PlaceMultilang.findById(placeMultilangId);
            placeMultilang = await placeMultilang.remove();
            res.json(placeMultilang);
        } catch (e) {
            res.send(e.toString());
        }
    }
};
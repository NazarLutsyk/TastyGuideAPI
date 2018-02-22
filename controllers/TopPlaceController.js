let TopPlace = require('../models/TopPlace');

module.exports = {
    async getTopPlaces(req, res) {
        try {
            let topPlaces = await TopPlace.find({});
            res.json(topPlaces);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async getTopPlaceById(req, res) {
        let topPlaceId = req.params.id;
        try {
            let topPlace = await TopPlace.findById(topPlaceId);
            res.json(topPlace);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async createTopPlace(req, res) {
        try {
            let topPlace = await TopPlace.create(req.body);
            res.json(topPlace);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async updateTopPlace(req, res) {
        let topPlaceId = req.params.id;
        try {
            let topPlace = await TopPlace.findByIdAndUpdate(topPlaceId, req.body,{new : true});
            res.json(topPlace);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async removeTopPlace(req, res) {
        let topPlaceId = req.params.id;
        try {
            let topPlace = await TopPlace.findById(topPlaceId);
            topPlace = await topPlace.remove();
            res.json(topPlace);
        } catch (e) {
            res.send(e.toString());
        }
    }
};
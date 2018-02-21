let TopPlace = require('../models/TopPlace');

module.exports = {
    async getTopPlaces(req, res) {
        try {
            let topPlaces = await TopPlace.find({});
            res.json(topPlaces);
        } catch (e) {
            res.json(e);
        }
    },
    async getTopPlaceById(req, res) {
        let topPlaceId = req.params.id;
        try {
            let topPlace = await TopPlace.findById(topPlaceId);
            res.json(topPlace);
        } catch (e) {
            res.json(e);
        }
    },
    async createTopPlace(req, res) {
        try {
            let topPlace = await TopPlace.create(req.body);
            res.json(topPlace);
        } catch (e) {
            res.json(e);
        }
    },
    async updateTopPlace(req, res) {
        let topPlaceId = req.params.id;
        try {
            let topPlace = await TopPlace.findByIdAndUpdate(topPlaceId, req.body,{new : true});
            res.json(topPlace);
        } catch (e) {
            res.json(e);
        }
    },
    async removeTopPlace(req, res) {
        let topPlaceId = req.params.id;
        try {
            let topPlace = await TopPlace.findById(topPlaceId);
            topPlace = await topPlace.remove();
            res.json(topPlace);
        } catch (e) {
            res.json(e);
        }
    }
};
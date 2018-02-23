let TopPlace = require('../models/TopPlace');

module.exports = {
    async getTopPlaces(req, res) {
        try {
            let topPlaceQuery = TopPlace
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    topPlaceQuery.populate(populateField);
                }
            }
            let topPlaces = await topPlaceQuery.exec();
            res.json(topPlaces);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async getTopPlaceById(req, res) {
        let topPlaceId = req.params.id;
        try {
            let topPlaceQuery = TopPlace.find({_id: topPlaceId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    topPlaceQuery.populate(populateField);
                }
            }
            let topPlace = await topPlaceQuery.exec();
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
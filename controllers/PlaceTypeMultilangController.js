let PlaceTypeMultilang = require('../models/PlaceTypeMultilang');

module.exports = {
    async getPlaceTypeMultilangs(req, res) {
        try {
            let placeTypeMultilangQuery = PlaceTypeMultilang
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    placeTypeMultilangQuery.populate(populateField);
                }
            }
            let placeTypeMultilangs = await placeTypeMultilangQuery.exec();
            res.json(placeTypeMultilangs);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async getPlaceTypeMultilangById(req, res) {
        let placeTypeMultilangId = req.params.id;
        try {
            let placeTypeMultilangQuery = PlaceTypeMultilang.find({_id: placeTypeMultilangId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    placeTypeMultilangQuery.populate(populateField);
                }
            }
            let placeTypeMultilang = await placeTypeMultilangQuery.exec();
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
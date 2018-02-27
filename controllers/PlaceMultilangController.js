let PlaceMultilang = require('../models/PlaceMultilang');

module.exports = {
    async getPlaceMultilangs(req, res) {
        try {
            let placeMultilangQuery = PlaceMultilang
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    placeMultilangQuery.populate(populateField);
                }
            }
            let placeMultilangs = await placeMultilangQuery.exec();
            res.json(placeMultilangs);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async getPlaceMultilangById(req, res) {
        let placeMultilangId = req.params.id;
        try {
            let placeMultilangQuery = PlaceMultilang.find({_id: placeMultilangId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    placeMultilangQuery.populate(populateField);
                }
            }
            let placeMultilang = await placeMultilangQuery.exec();
            res.json(placeMultilang);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async createPlaceMultilang(req, res) {
        try {
            let placeMultilang = await PlaceMultilang.create(req.body);
            res.status(201).json(placeMultilang);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updatePlaceMultilang(req, res) {
        let placeMultilangId = req.params.id;
        try {
            let placeMultilang = await PlaceMultilang.findByIdAndUpdate(placeMultilangId, req.body,{new : true});
            res.status(201).json(placeMultilang);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removePlaceMultilang(req, res) {
        let placeMultilangId = req.params.id;
        try {
            let placeMultilang = await PlaceMultilang.findById(placeMultilangId);
            placeMultilang = await placeMultilang.remove();
            res.status(204).json(placeMultilang);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};
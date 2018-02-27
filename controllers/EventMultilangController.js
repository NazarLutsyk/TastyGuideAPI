let EventMultilang = require('../models/EventMultilang');

module.exports = {
    async getEventMultilangs(req, res) {
        try {
            let eventMultilangQuery = await EventMultilang
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    eventMultilangQuery.populate(populateField);
                }
            }
            let eventMultilangs = await eventMultilangQuery.exec();
            res.json(eventMultilangs);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async getEventMultilangById(req, res) {
        let eventMultilangId = req.params.id;
        try {
            let eventMultilangQuery = EventMultilang.find({_id: eventMultilangId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    eventMultilangQuery.populate(populateField);
                }
            }
            let eventMultilang = await eventMultilangQuery.exec();
            res.json(eventMultilang);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async createEventMultilang(req, res) {
        try {
            let eventMultilang = await EventMultilang.create(req.body);
            res.status(201).json(eventMultilang);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updateEventMultilang(req, res) {
        let eventMultilangId = req.params.id;
        try {
            let eventMultilang = await EventMultilang.findByIdAndUpdate(eventMultilangId, req.body,{new : true});
            res.status(201).json(eventMultilang);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeEventMultilang(req, res) {
        let eventMultilangId = req.params.id;
        try {
            let eventMultilang = await EventMultilang.findById(eventMultilangId);
            eventMultilang = await eventMultilang.remove();
            res.status(204).json(eventMultilang);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};
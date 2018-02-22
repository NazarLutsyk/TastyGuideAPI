let EventMultilang = require('../models/EventMultilang');

module.exports = {
    async getEventMultilangs(req, res) {
        try {
            let eventMultilangs = await EventMultilang.find({});
            res.json(eventMultilangs);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async getEventMultilangById(req, res) {
        let eventMultilangId = req.params.id;
        try {
            let eventMultilang = await EventMultilang.findById(eventMultilangId);
            res.json(eventMultilang);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async createEventMultilang(req, res) {
        try {
            let eventMultilang = await EventMultilang.create(req.body);
            res.json(eventMultilang);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async updateEventMultilang(req, res) {
        let eventMultilangId = req.params.id;
        try {
            let eventMultilang = await EventMultilang.findByIdAndUpdate(eventMultilangId, req.body,{new : true});
            res.json(eventMultilang);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async removeEventMultilang(req, res) {
        let eventMultilangId = req.params.id;
        try {
            let eventMultilang = await EventMultilang.findById(eventMultilangId);
            eventMultilang = await eventMultilang.remove();
            res.json(eventMultilang);
        } catch (e) {
            res.send(e.toString());
        }
    }
};
let EventMultilang = require('../models/EventMultilang');

module.exports = {
    async getEventMultilangs(req, res) {
        try {
            let eventMultilangs = await EventMultilang.find({});
            res.json(eventMultilangs);
        } catch (e) {
            res.json(e);
        }
    },
    async getEventMultilangById(req, res) {
        let eventMultilangId = req.params.id;
        try {
            let eventMultilang = await EventMultilang.findById(eventMultilangId);
            res.json(eventMultilang);
        } catch (e) {
            res.json(e);
        }
    },
    async createEventMultilang(req, res) {
        try {
            let eventMultilang = await EventMultilang.create(req.body);
            res.json(eventMultilang);
        } catch (e) {
            res.json(e);
        }
    },
    async updateEventMultilang(req, res) {
        let eventMultilangId = req.params.id;
        try {
            let eventMultilang = await EventMultilang.findByIdAndUpdate(eventMultilangId, req.body,{new : true});
            res.json(eventMultilang);
        } catch (e) {
            res.json(e);
        }
    },
    async removeEventMultilang(req, res) {
        let eventMultilangId = req.params.id;
        try {
            let eventMultilang = await EventMultilang.findById(eventMultilangId);
            eventMultilang = await eventMultilang.remove();
            res.json(eventMultilang);
        } catch (e) {
            res.json(e);
        }
    }
};
let Event = require('../models/Event');

module.exports = {
    async getEvents(req, res) {
        try {
            let events = await Event.find({});
            res.json(events);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async getEventById(req, res) {
        let eventId = req.params.id;
        try {
            let event = await Event.findById(eventId);
            res.json(event);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async createEvent(req, res) {
        try {
            let event = await Event.create(req.body);
            res.json(event);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async updateEvent(req, res) {
        let eventId = req.params.id;
        try {
            let event = await Event.findByIdAndUpdate(eventId, req.body,{new : true});
            res.json(event);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async removeEvent(req, res) {
        let eventId = req.params.id;
        try {
            let event = await Event.findById(eventId);
            event = await event.remove();
            res.json(event);
        } catch (e) {
            res.send(e.toString());
        }
    }
};
let Event = require('../models/Event');

module.exports = {
    async getEvents(req, res) {
        try {
            let eventQuery = Event
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    eventQuery.populate(populateField);
                }
            }
            let events = await eventQuery.exec();
            res.json(events);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async getEventById(req, res) {
        let eventId = req.params.id;
        try {
            let eventQuery = Event.find({_id: eventId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    eventQuery.populate(populateField);
                }
            }
            let event = await eventQuery.exec();
            res.json(event);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async createEvent(req, res) {
        try {
            let event = await Event.create(req.body);
            res.status(201).json(event);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updateEvent(req, res) {
        let eventId = req.params.id;
        try {
            let event = await Event.findByIdAndUpdate(eventId, req.body,{new : true});
            res.status(201).json(event);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeEvent(req, res) {
        let eventId = req.params.id;
        try {
            let event = await Event.findById(eventId);
            event = await event.remove();
            res.status(204).json(event);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};
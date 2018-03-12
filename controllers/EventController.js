let Event = require(global.paths.MODELS + '/Event');
let relationHelper = require(global.paths.HELPERS + '/relationHelper');
let keysValidator = require(global.paths.VALIDATORS + '/keysValidator');

let path = require('path');
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
            res.status(400).send(e.toString());
        }
    },
    async getEventById(req, res) {
        let eventId = req.params.id;
        try {
            let eventQuery = Event.findOne({_id: eventId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    eventQuery.populate(populateField);
                }
            }
            let event = await eventQuery.exec();
            res.json(event);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async createEvent(req, res) {
        try {
            let err = keysValidator.diff(Event.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let event = await Event.create(req.body);
                res.status(201).json(event);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updateEvent(req, res) {
        let eventId = req.params.id;
        try {
            let err = keysValidator.diff(Event.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let updated = await Event.findByIdAndUpdate(eventId, req.body, {runValidators: true,context:'query'});
                if (updated) {
                    res.status(201).json(await Event.findById(eventId));
                } else {
                    res.sendStatus(404);
                }
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeEvent(req, res) {
        let eventId = req.params.id;
        try {
            let event = await Event.findById(eventId);
            if (eventId) {
                event = await event.remove();
                res.status(204).json(event);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async addMultilang(req, res) {
        let modelId = req.params.id;
        let multilangId = req.params.idMultilang;
        try {
            if (modelId && multilangId) {
                await relationHelper.addRelation
                ('Event', 'EventMultilang', modelId, multilangId, 'multilang', 'event');
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeMultilang(req, res) {
        let modelId = req.params.id;
        let multilangId = req.params.idMultilang;
        try {
            if (modelId && multilangId) {
                await relationHelper.removeRelation
                ('Event', 'EventMultilang', modelId, multilangId, 'multilang', 'event');
                res.sendStatus(204);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }

};
let Event = require(global.paths.MODELS + '/Event');
let keysValidator = require(global.paths.VALIDATORS + '/keysValidator');
let upload = require(global.paths.MIDDLEWARE + '/multer');
upload = upload.array('images');
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
                let event = new Event(req.body);
                if (event) {
                    upload(req, res, async function (err) {
                        if (err) {
                            return res.status(400).send(err.toString());
                        } else {
                            if(!event.images)
                                event.images = [];
                            for (let file in req.files) {
                                let image = req.files[file].path;
                                event.images.push(image);
                            }
                            try {
                                event = await event.supersave();
                                res.status(201).json(event);
                            } catch (e) {
                                res.status(400).send(e.toString());
                            }
                        }
                    });
                }else {
                    res.sendStatus(404);
                }
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
                let event = await Event.findById(eventId);
                if (event) {
                    upload(req, res, async function (err) {
                        if (err) {
                            return res.status(400).send(err.toString());
                        } else {
                            if(!req.body.images)
                                req.body.images = [];
                            for (let file in req.files) {
                                let image = req.files[file].path;
                                req.body.images.push(image);
                            }
                            try {
                                let updated = await event.superupdate(req.body);
                                res.status(201).json(updated);
                            } catch (e) {
                                res.status(400).send(e.toString());
                            }
                        }
                    });
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
            if (event) {
                event = await event.remove();
                res.status(204).json(event);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },

};
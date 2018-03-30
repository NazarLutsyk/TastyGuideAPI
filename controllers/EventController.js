let Event = require('../models/Event');
let keysValidator = require('../validators/keysValidator');
let path = require('path');
let upload = require('../middleware/multer')(path.join(__dirname,'../public', 'upload', 'promo'));
upload = upload.array('images');
module.exports = {
    async getEvents(req, res,next) {
        try {
            let eventQuery;
            if (req.query.aggregate) {
                eventQuery = Event.aggregate(req.query.aggregate);
            } else {
                eventQuery = Event
                    .find(req.query.query)
                    .sort(req.query.sort)
                    .select(req.query.fields)
                    .skip(req.query.skip)
                    .limit(req.query.limit);
                if (req.query.populate) {
                    for (let populateField of req.query.populate) {
                        eventQuery.populate(populateField);
                    }
                }
            }
            let events = await eventQuery.exec();
            res.json(events);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getEventById(req, res,next) {
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
            e.status = 400;
            return next(e);
        }
    },
    async createEvent(req, res,next) {
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
                            if (!event.images)
                                event.images = [];
                            for (let file in req.files) {
                                let image = req.files[file].filename;
                                event.images.push(image);
                            }
                            try {
                                event.author = req.user._id;
                                event = await event.supersave();
                                res.status(201).json(event);
                            } catch (e) {
                                e.status = 400;
                                return next(e);
                            }
                        }
                    });
                } else {
                    let e = new Error();
                    e.message = "Not found";
                    e.status = 404;
                    return next(e);
                }
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async updateEvent(req, res,next) {
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
                            if (!req.body.images)
                                req.body.images = [];
                            for (let file in req.files) {
                                let image = req.files[file].filename;
                                req.body.images.push(image);
                            }
                            try {
                                let updated = await event.superupdate(req.body);
                                res.status(201).json(updated);
                            } catch (e) {
                                e.status = 400;
                                return next(e);
                            }
                        }
                    });
                } else {
                    let e = new Error();
                    e.message = "Not found";
                    e.status = 404;
                    return next(e);
                }
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async removeEvent(req, res,next) {
        let eventId = req.params.id;
        try {
            let event = await Event.findById(eventId);
            if (event) {
                event = await event.remove();
                res.status(204).json(event);
            } else {
                let e = new Error();
                e.message = "Not found";
                e.status = 404;
                return next(e);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },

};
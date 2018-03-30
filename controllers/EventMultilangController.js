let EventMultilang = require('../models/EventMultilang');
let keysValidator = require('../validators/keysValidator');

module.exports = {
    async getEventMultilangs(req, res,next) {
        try {
            let eventMultilangQuery;
            if (req.query.aggregate) {
                eventMultilangQuery = EventMultilang.aggregate(req.query.aggregate);
            } else {
                eventMultilangQuery = EventMultilang
                    .find(req.query.query)
                    .sort(req.query.sort)
                    .select(req.query.fields)
                    .skip(req.query.skip)
                    .limit(req.query.limit);
                if (req.query.populate) {
                    for (let populateField of req.query.populate) {
                        eventMultilangQuery.populate(populateField);
                    }
                }
            }
            let eventMultilangs = await eventMultilangQuery.exec();
            res.json(eventMultilangs);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getEventMultilangById(req, res,next) {
        let eventMultilangId = req.params.id;
        try {
            let eventMultilangQuery = EventMultilang.findOne({_id: eventMultilangId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    eventMultilangQuery.populate(populateField);
                }
            }
            let eventMultilang = await eventMultilangQuery.exec();
            res.json(eventMultilang);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createEventMultilang(req, res,next) {
        try {
            let err = keysValidator.diff(EventMultilang.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let eventMultilang = new EventMultilang(req.body);
                eventMultilang = await eventMultilang.supersave();
                res.status(201).json(eventMultilang);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async updateEventMultilang(req, res,next) {
        let eventMultilangId = req.params.id;
        try {
            let err = keysValidator.diff(EventMultilang.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let eventMultilang = await EventMultilang.findById(eventMultilangId);
                if (eventMultilang) {
                    let updated = await eventMultilang.superupdate(req.body);
                    res.status(201).json(updated);
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
    async removeEventMultilang(req, res,next) {
        let eventMultilangId = req.params.id;
        try {
            let eventMultilang = await EventMultilang.findById(eventMultilangId);
            if (eventMultilang) {
                eventMultilang = await eventMultilang.remove();
                res.status(204).json(eventMultilang);
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
    }
};
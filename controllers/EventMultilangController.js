let EventMultilang = require(global.paths.MODELS + '/EventMultilang');
let keysValidator = require(global.paths.VALIDATORS + '/keysValidator');
let objectHelper = require(global.paths.HELPERS + '/objectHelper');

module.exports = {
    async getEventMultilangs(req, res) {
        try {
            let eventMultilangQuery = EventMultilang
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
            res.status(400).send(e.toString());
        }
    },
    async getEventMultilangById(req, res) {
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
            res.status(400).send(e.toString());
        }
    },
    async createEventMultilang(req, res) {
        try {
            let err = keysValidator.diff(EventMultilang.schema.tree, req.body);
            if (err){
                throw new Error('Unknown fields ' + err);
            } else {
                let eventMultilang = new EventMultilang(req.body);
                eventMultilang = await eventMultilang.supersave();
                res.status(201).json(eventMultilang);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updateEventMultilang(req, res) {
        let eventMultilangId = req.params.id;
        try {
            let err = keysValidator.diff(EventMultilang.schema.tree, req.body);
            if (err){
                throw new Error('Unknown fields ' + err);
            } else {
                let eventMultilang = await EventMultilang.findById(eventMultilangId);
                if (eventMultilang) {
                    let updated = await eventMultilang.superupdate(req.body);
                    res.status(201).json(updated);
                }else {
                    res.sendStatus(404);
                }
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeEventMultilang(req, res) {
        let eventMultilangId = req.params.id;
        try {
            let eventMultilang = await EventMultilang.findById(eventMultilangId);
            if (eventMultilang) {
                eventMultilang = await eventMultilang.remove();
                res.status(204).json(eventMultilang);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};
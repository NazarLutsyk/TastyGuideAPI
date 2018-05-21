let Event = require("../models/Event");
let keysValidator = require("../validators/keysValidator");
let path = require("path");
let upload = require("../middleware/multer")(path.join(__dirname, "../public", "upload", "promo"));
upload = upload.single("image");
module.exports = {
    async getEvents(req, res, next) {
        try {
            res.json(await Event.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getEventById(req, res, next) {
        let eventId = req.params.id;
        try {
            req.query.query._id = eventId;
            let event = await Event.superfind(req.query);
            res.json(event[0]);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createEvent(req, res, next) {
        try {
            let err = keysValidator.diff(Event.schema.tree, req.body);
            if (err) {
                throw new Error("Unknown fields " + err);
            } else {
                let event = new Event(req.body);
                if (event) {
                    upload(req, res, async function (err) {
                        if (err) {
                            return res.status(400).send(err.toString());
                        } else {
                            event.image = req.file ? "/upload/promo/" + req.file.filename : "";
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
    async updateEvent(req, res, next) {
        let eventId = req.params.id;
        try {
            let err = keysValidator.diff(Event.schema.tree, req.body);
            if (err) {
                throw new Error("Unknown fields " + err);
            } else {
                let event = await Event.findById(eventId);
                if (event) {
                    upload(req, res, async function (err) {
                        if (err) {
                            return res.status(400).send(err.toString());
                        } else if(req.file){
                            req.body.image = "/upload/promo/" + req.file.filename;
                        }
                        try {
                            let updated = await event.superupdate(req.body);
                            res.status(201).json(updated);
                        } catch (e) {
                            e.status = 400;
                            return next(e);
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
    async removeEvent(req, res, next) {
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
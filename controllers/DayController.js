let Day = require("../models/Day");
let keysValidator = require("../validators/keysValidator");

module.exports = {
    async getDays(req, res, next) {
        try {
            res.json(await Day.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getDayById(req, res, next) {
        let dayId = req.params.id;
        try {
            req.query.target.query._id = dayId;
            res.json(await Day.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createDay(req, res, next) {
        try {
            let err = keysValidator.diff(Day.schema.tree, req.body);
            if (err) {
                throw new Error("Unknown fields " + err);
            } else {
                let day = new Day(req.body);
                day = await day.supersave();
                res.status(201).json(day);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async updateDay(req, res, next) {
        let dayId = req.params.id;
        try {
            let err = keysValidator.diff(Day.schema.tree, req.body);
            if (err) {
                throw new Error("Unknown fields " + err);
            } else {
                let day = await Day.findById(dayId);
                if (day) {
                    let updated = await day.superupdate(req.body);
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
    async removeDay(req, res, next) {
        let dayId = req.params.id;
        try {
            let day = await Day.findById(dayId);
            if (day) {
                day = await day.remove();
                res.status(204).json(day);
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
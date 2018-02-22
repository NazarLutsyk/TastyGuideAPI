let Day = require('../models/Day');

module.exports = {
    async getDays(req, res) {
        try {
            let days = await Day.find({});
            res.json(days);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async getDayById(req, res) {
        let dayId = req.params.id;
        try {
            let day = await Day.findById(dayId);
            res.json(day);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async createDay(req, res) {
        try {
            let day = await Day.create(req.body);
            res.json(day);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async updateDay(req, res) {
        let dayId = req.params.id;
        try {
            let day = await Day.findByIdAndUpdate(dayId, req.body,{new : true});
            res.json(day);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async removeDay(req, res) {
        let dayId = req.params.id;
        try {
            let day = await Day.findById(dayId);
            day = await day.remove();
            res.json(day);
        } catch (e) {
            res.send(e.toString());
        }
    }
};
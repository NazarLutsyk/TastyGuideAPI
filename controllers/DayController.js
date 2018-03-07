let Day = require(global.paths.MODELS + '/Day');

module.exports = {
    async getDays(req, res) {
        try {
            let dayQuery = Day
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    dayQuery.populate(populateField);
                }
            }
            let days = await dayQuery.exec();
            res.json(days);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async getDayById(req, res) {
        let dayId = req.params.id;
        try {
            let dayQuery = Day.find({_id: dayId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    dayQuery.populate(populateField);
                }
            }
            let day = await dayQuery.exec();
            res.json(day);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async createDay(req, res) {
        try {
            let day = await Day.create(req.body);
            res.status(201).json(day);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updateDay(req, res) {
        let dayId = req.params.id;
        try {
            let day = await Day.findByIdAndUpdate(dayId, req.body,{new : true});
            res.status(201).json(day);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeDay(req, res) {
        let dayId = req.params.id;
        try {
            let day = await Day.findById(dayId);
            day = await day.remove();
            res.status(204).json(day);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};
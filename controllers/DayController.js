let Day = require(global.paths.MODELS + '/Day');
let keysValidator = require(global.paths.VALIDATORS + '/keysValidator');

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
            res.status(400).send(e.toString());
        }
    },
    async getDayById(req, res) {
        let dayId = req.params.id;
        try {
            let dayQuery = Day.findOne({_id: dayId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    dayQuery.populate(populateField);
                }
            }
            let day = await dayQuery.exec();
            res.json(day);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async createDay(req, res) {
        try {
            let err = keysValidator.diff(Day.schema.tree, req.body);
            if (err){
                throw new Error('Unknown fields ' + err);
            } else {
                let day = await Day.create(req.body);
                res.status(201).json(day);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updateDay(req, res) {
        let dayId = req.params.id;
        try {
            let err = keysValidator.diff(Day.schema.tree, req.body);
            if (err){
                throw new Error('Unknown fields ' + err);
            } else {
                let updated = await Day.findByIdAndUpdate(dayId, req.body,{runValidators: true,context:'query'});
                if(updated) {
                    res.status(201).json(await Day.findById(dayId));
                }else {
                    res.sendStatus(404);
                }
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeDay(req, res) {
        let dayId = req.params.id;
        try {
            let day = await Day.findById(dayId);
            if (day) {
                day = await day.remove();
                res.status(204).json(day);
            }else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};
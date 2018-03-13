let Location = require(global.paths.MODELS + '/Location');
let keysValidator = require(global.paths.VALIDATORS + '/keysValidator');
let objectHelper = require(global.paths.HELPERS + '/objectHelper');

module.exports = {
    async getLocations(req, res) {
        try {
            let locationQuery = Location
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    locationQuery.populate(populateField);
                }
            }
            let locations = await locationQuery.exec();
            res.json(locations);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async getLocationById(req, res) {
        let locationId = req.params.id;
        try {
            let locationQuery = Location.findOne({_id: locationId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    locationQuery.populate(populateField);
                }
            }
            let location = await locationQuery.exec();
            res.json(location);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async createLocation(req, res) {
        try {
            let err = keysValidator.diff(Location.schema.tree, req.body);
            if (err){
                throw new Error('Unknown fields ' + err);
            } else {
                let location = await Location.create(req.body);
                res.status(201).json(location);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updateLocation(req, res) {
        let locationId = req.params.id;
        try {
            let err = keysValidator.diff(Location.schema.tree, req.body);
            if (err){
                throw new Error('Unknown fields ' + err);
            } else {
                let location = await Location.findById(locationId);
                if (location) {
                    objectHelper.load(location, req.body);
                    let updated = await location.save();
                    res.status(201).json(updated);
                }else {
                    res.sendStatus(404);
                }
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeLocation(req, res) {
        let locationId = req.params.id;
        try {
            let location = await Location.findById(locationId);
            if (location) {
                await location.remove();
                res.status(204).json(location);
            }else {
                res.sendStatus(404);
            }
        } catch (e) {
            console.log(e);
            res.status(400).send(e.toString());
        }
    }
};
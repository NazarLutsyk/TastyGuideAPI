let Location = require(global.paths.MODELS + '/Location');

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
            res.status(404).send(e.toString());
        }
    },
    async getLocationById(req, res) {
        let locationId = req.params.id;
        try {
            let locationQuery = Location.find({_id: locationId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    locationQuery.populate(populateField);
                }
            }
            let location = await locationQuery.exec();
            res.json(location);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
    async createLocation(req, res) {
        try {
            let location = await Location.create(req.body);
            res.status(201).json(location);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updateLocation(req, res) {
        let locationId = req.params.id;
        try {
            let location = await Location.findByIdAndUpdate(locationId, req.body,{new : true});
            res.status(201).json(location);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeLocation(req, res) {
        let locationId = req.params.id;
        try {
            let location = await Location.findByIdAndRemove(locationId);
            res.status(204).json(location);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    }
};
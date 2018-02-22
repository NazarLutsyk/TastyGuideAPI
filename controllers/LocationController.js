let Location = require('../models/Location');

module.exports = {
    async getLocations(req, res) {
        try {
            let locations = await Location.find({});
            res.json(locations);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async getLocationById(req, res) {
        let locationId = req.params.id;
        try {
            let location = await Location.findById(locationId);
            res.json(location);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async createLocation(req, res) {
        try {
            let location = await Location.create(req.body);
            res.json(location);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async updateLocation(req, res) {
        let locationId = req.params.id;
        try {
            let location = await Location.findByIdAndUpdate(locationId, req.body,{new : true});
            res.json(location);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async removeLocation(req, res) {
        let locationId = req.params.id;
        try {
            let location = await Location.findByIdAndRemove(locationId);
            res.json(location);
        } catch (e) {
            res.send(e.toString());
        }
    }
};
let Place = require(global.paths.MODELS + '/Place');
let keysValidator = require(global.paths.VALIDATORS + '/keysValidator');
let ROLES = require(global.paths.CONFIG + '/roles');
let upload = require(global.paths.MIDDLEWARE + '/multer');
upload = upload.array('images');

let path = require('path');
module.exports = {
    async getPlaces(req, res) {
        try {
            let placeQuery = Place
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    placeQuery.populate(populateField);
                }
            }
            let places = await placeQuery.exec();
            res.json(places);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async getPlaceById(req, res) {
        let placeId = req.params.id;
        try {
            let PlaceQuery = Place.findOne({_id: placeId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    PlaceQuery.populate(populateField);
                }
            }
            let place = await PlaceQuery.exec();
            res.json(place);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async createPlace(req, res) {
        try {
            let err = keysValidator.diff(Place.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let place = new Place(req.body);
                if (place) {
                    upload(req, res, async function (err) {
                        if (err) {
                            return res.status(400).send(err.toString());
                        } else {
                            if (!place.images)
                                place.images = [];
                            for (let file in req.files) {
                                let image = req.files[file].path;
                                place.images.push(image);
                            }
                            try {
                                place.boss = req.user._id;
                                place = await place.supersave();
                                res.status(201).json(place);
                            } catch (e) {
                                res.status(400).send(e.toString());
                            }
                        }
                    });
                }
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async updatePlace(req, res) {
        let placeId = req.params.id;
        try {
            let err = keysValidator.diff(Place.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let place = await Place.findById(placeId);
                if (place) {
                    if (req.body.boss && req.user.roles.indexOf(ROLES.GLOBAL_ROLES.ADMIN_ROLE) == -1) {
                        res.sendStatus(403);
                    } else {
                        upload(req, res, async function (err) {
                            if (err) {
                                return res.status(400).send(err.toString());
                            } else {
                                if (!req.body.images)
                                    req.body.images = [];
                                for (let file in req.files) {
                                    let image = req.files[file].path;
                                    req.body.images.push(image);
                                }
                                try {
                                    let updated = await place.superupdate(req.body);
                                    res.status(201).json(updated);
                                } catch (e) {
                                    res.status(400).send(e.toString());
                                }
                            }
                        });
                    }
                } else {
                    res.sendStatus(404);
                }
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removePlace(req, res) {
        let placeId = req.params.id;
        try {
            let removedPlace = await Place.findById(placeId);
            if (removedPlace) {
                removedPlace = await removedPlace.remove();
                res.sendStatus(204);
            } else {
                res.sendStatus(404);
            }
        } catch (e) {
            console.log(e);
            res.status(400).send(e.toString());
        }
    },
};
let path = require("path");
let Place = require("../models/Place");
let Department = require("../models/Department");
let keysValidator = require("../validators/keysValidator");
let ROLES = require("../config/roles");
let upload = require("../middleware/multer")(path.join(__dirname, "../public", "upload", "place"));
upload = upload.array("images");

module.exports = {
    async getPlaces(req, res, next) {
        try {
            res.json(await Place.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getPlaceById(req, res, next) {
        let placeId = req.params.id;
        try {
            req.query.target.query._id = placeId;
            res.json(await Place.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async createPlace(req, res, next) {
        try {
            let err = keysValidator.diff(Place.schema.tree, req.body);
            if (err) {
                throw new Error("Unknown fields " + err);
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
                                let image = req.files[file].filename;
                                place.images.push(image);
                            }
                            try {
                                place = await place.supersave();
                                await Department.create({
                                    client: req.user._id,
                                    place: place._id,
                                    roles: [ROLES.PLACE_ROLES.BOSS_ROLE]
                                });
                                await Place.loadAsyncValues(place);
                                res.status(201).json(place);
                            } catch (e) {
                                e.status = 400;
                                return next(e);
                            }
                        }
                    });
                }
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async updatePlace(req, res, next) {
        let placeId = req.params.id;
        try {
            let err = keysValidator.diff(Place.schema.tree, req.body);
            if (err) {
                throw new Error("Unknown fields " + err);
            } else {
                let place = await Place.findById(placeId);
                if (place) {
                    upload(req, res, async function (err) {
                        if (err) {
                            e.status = 400;
                            return next(err);
                        } else {
                            if (!req.body.images)
                                req.body.images = [];
                            for (let file in req.files) {
                                let image = req.files[file].filename;
                                req.body.images.push(image);
                            }
                            try {
                                let updated = await place.superupdate(req.body);
                                await Place.loadAsyncValues(updated);
                                res.status(201).json(updated);
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
            return next(e);
        }
    },
    async removePlace(req, res, next) {
        let placeId = req.params.id;
        try {
            let removedPlace = await Place.findById(placeId);
            if (removedPlace) {
                removedPlace = await removedPlace.remove();
                res.sendStatus(204);
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
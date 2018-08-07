let path = require("path");
let fileHelper = require("../helpers/fileHelper");
let Place = require("../models/Place");
let Review = require("../models/Review");
let Department = require("../models/Department");
let keysValidator = require("../validators/keysValidator");
let ROLES = require("../config/roles");
let upload = require("../middleware/multer")(path.join(__dirname, "../public", "upload", "place"));
upload = upload.fields([{name: "avatar", maxCount: 1}, {name: "images", maxCount: 6}]);

let mongoose = require("mongoose");

module.exports = {
    async getPlaces(req, res, next) {
        try {
            if (JSON.stringify(req.query).search(/^[0-9a-fA-F]{24}$/)) {
                function iterate(obj, stack) {
                    for (let property in obj) {
                        if (obj.hasOwnProperty(property)) {
                            if (typeof obj[property] === "object") {
                                iterate(obj[property], stack + "." + property);
                            } else if (typeof obj[property] === "string" && obj[property].match(/^[0-9a-fA-F]{24}$/)) {
                                obj[property] = mongoose.Types.ObjectId(obj[property]);
                            }
                        }
                    }
                }
                iterate(req.query, "");
            }
            res.json(await Place.superfind(req.query));
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getPlaceById(req, res, next) {
        let placeId = req.params.id;
        try {
            req.query.query._id = placeId;
            let place = await Place.superfind(req.query);
            place = place[0];
            if (place) {
                await Review.create({place: place._id, client: req.user ? req.user._id : null});
                let toUpdate = await Place.findById(placeId);
                toUpdate.reviews++;
                place.reviews++;
                await toUpdate.supersave();
            }
            res.json(place);
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
                    try {
                        place = await place.supersave();
                        await Department.create({
                            client: req.user._id,
                            place: place._id,
                            roles: [ROLES.PLACE_ROLES.BOSS_ROLE]
                        });
                        res.status(201).json(place);
                    } catch (e) {
                        e.status = 400;
                        return next(e);
                    }
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
                    try {
                        let updated = await place.superupdate(req.body);
                        res.status(201).json(updated);
                    } catch (e) {
                        e.status = 400;
                        return next(e);
                    }
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
    upload(req, res, next) {
        upload(req, res, async function (err) {
            if (err) {
                e.status = 400;
                return next(err);
            } else {
                if (!req.body.images)
                    req.body.images = [];
                for (let field in req.files) {
                    for (let fileKey in req.files[field]) {
                        if (req.files[field][fileKey].fieldname === "avatar") {
                            let image = "/upload/place/" + req.files[field][fileKey].filename;
                            req.body.avatar = image;
                        }
                        if (req.files[field][fileKey].fieldname === "images") {
                            let image = "/upload/place/" + req.files[field][fileKey].filename;
                            req.body.images.push(image);
                        }
                    }
                }
                try {
                    let query = {};
                    if (req.body.avatar || req.body.images.length > 0) {
                        let place = await Place.findById(req.params.id);
                        if (req.body.avatar) {
                            query.avatar = req.body.avatar;
                            if (place.avatar) {
                                let toDelete = path.join(__dirname, "../public", place.avatar);
                                fileHelper.deleteFiles(toDelete);
                            }
                        }
                        if (req.body.images) {
                            console.log("here");
                            query.$push = {images: req.body.images};
                        }
                        console.log(query);
                        let placeRes = await Place.findByIdAndUpdate(req.params.id, query, {new: true});
                        res.status(201).json(placeRes);
                    }else {
                        res.sendStatus(201);
                    }
                } catch (e) {
                    e.status = 400;
                    return next(e);
                }
            }
        });
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
let Place = require(global.paths.MODELS + '/Place');
let keysValidator = require(global.paths.VALIDATORS + '/keysValidator');

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
                place = await place.supersave(Place);
                res.status(201).json(place);
            }
        } catch (e) {
            console.log(e);
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
                    let updated = await place.superupdate(Place, req.body);
                    res.status(201).json(updated);
                } else {
                    res.sendStatus(404);
                }
            }
        } catch (e) {
            console.log(e);
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
            res.status(400).send(e.toString());
        }
    },
    async addPlaceType(req, res) {
        let modelId = req.params.id;
        let typeId = req.params.idType;
        try {
            if (modelId && typeId) {
                let place = await Place.findById(modelId);
                await place.superupdate(Place, {
                    types: place.types.concat(typeId)
                });
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removePlaceType(req, res) {
        let modelId = req.params.id;
        let typeId = req.params.idType;
        try {
            if (modelId && typeId) {
                let place = await Place.findById(modelId);
                place.types.splice(place.types.indexOf(typeId), 1);
                await place.superupdate(Place, {
                    types: place.types
                });
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async addPromo(req, res) {
        let modelId = req.params.id;
        let promoId = req.params.idPromo;
        try {
            if (modelId && promoId) {
                let place = await Place.findById(modelId);
                await place.superupdate(Place, {
                    promos: place.promos.concat(promoId)
                });
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removePromo(req, res) {
        let modelId = req.params.id;
        let promoId = req.params.idPromo;
        try {
            if (modelId && promoId) {
                let place = await Place.findById(modelId);
                place.promos.splice(place.promos.indexOf(promoId), 1);
                await place.superupdate(Place, {
                    promos: place.promos
                });
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async addComplaint(req, res) {
        let modelId = req.params.id;
        let complaintId = req.params.idComplaint;
        try {
            if (modelId && complaintId) {
                let place = await Place.findById(modelId);
                await place.superupdate(Place, {
                    complaints: place.complaints.concat(complaintId)
                });
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeComplaint(req, res) {
        let modelId = req.params.id;
        let complaintId = req.params.idComplaint;
        try {
            if (modelId && complaintId) {
                let place = await Place.findById(modelId);
                place.complaints.splice(place.complaints.indexOf(complaintId), 1);
                await place.superupdate(Place, {
                    complaints: place.complaints
                });
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async addDrinkApp(req, res) {
        let modelId = req.params.id;
        let appId = req.params.idApp;
        try {
            if (modelId && appId) {
                let place = await Place.findById(modelId);
                await place.superupdate(Place, {
                    drinkApplications: place.drinkApplications.concat(appId)
                });
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeDrinkApp(req, res) {
        let modelId = req.params.id;
        let appId = req.params.idApp;
        try {
            if (modelId && appId) {
                let place = await Place.findById(modelId);
                place.drinkApplications.splice(place.drinkApplications.indexOf(appId), 1);
                await place.superupdate(Place, {
                    drinkApplications: place.drinkApplications
                });
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async addRating(req, res) {
        let modelId = req.params.id;
        let ratingId = req.params.idRating;
        try {
            if (modelId && ratingId) {
                let place = await Place.findById(modelId);
                await place.superupdate(Place, {
                    ratings: place.ratings.concat(ratingId)
                });
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeRating(req, res) {
        let modelId = req.params.id;
        let ratingId = req.params.idRating;
        try {
            if (modelId && ratingId) {
                let place = await Place.findById(modelId);
                place.ratings.splice(place.ratings.indexOf(ratingId), 1);
                await place.superupdate(Place, {
                    ratings: place.ratings
                });
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async addDepartment(req, res) {
        let modelId = req.params.id;
        let departmentId = req.params.idDepartment;
        try {
            if (modelId && departmentId) {
                let place = await Place.findById(modelId);
                await place.superupdate(Place, {
                    departments: place.departments.concat(departmentId)
                });
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeDepartment(req, res) {
        let modelId = req.params.id;
        let departmentId = req.params.idDepartment;
        try {
            if (modelId && departmentId) {
                let place = await Place.findById(modelId);
                place.departments.splice(place.departments.indexOf(departmentId), 1);
                await place.superupdate(Place, {
                    departments: place.departments
                });
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async addMultilang(req, res) {
        let modelId = req.params.id;
        let multilangId = req.params.idMultilang;
        try {
            if (modelId && multilangId) {
                let place = await Place.findById(modelId);
                await place.superupdate(Place, {
                    multilang: place.multilang.concat(multilangId)
                });
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeMultilang(req, res) {
        let modelId = req.params.id;
        let multilangId = req.params.idMultilang;
        try {
            if (modelId && multilangId) {
                let place = await Place.findById(modelId);
                place.multilang.splice(place.multilang.indexOf(multilangId), 1);
                await place.superupdate(Place, {
                    multilang: place.multilang
                });
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async addDay(req, res) {
        let modelId = req.params.id;
        let dayId = req.params.idDay;
        try {
            if (modelId && dayId) {
                let place = await Place.findById(modelId);
                await place.superupdate(Place, {
                    days: place.days.concat(dayId)
                });
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeDay(req, res) {
        let modelId = req.params.id;
        let dayId = req.params.idDay;
        try {
            if (modelId && dayId) {
                let place = await Place.findById(modelId);
                place.days.splice(place.days.indexOf(dayId), 1);
                await place.superupdate(Place, {
                    days: place.days
                });
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async addHashTag(req, res) {
        let modelId = req.params.id;
        let hashTagId = req.params.idHashTag;
        try {
            if (modelId && hashTagId) {
                let place = await Place.findById(modelId);
                await place.superupdate(Place, {
                    hashTags: place.hashTags.concat(hashTagId)
                });
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeHashTag(req, res) {
        let modelId = req.params.id;
        let hashTagId = req.params.idHashTag;
        try {
            if (modelId && hashTagId) {
                let place = await Place.findById(modelId);
                place.hashTags.splice(place.hashTags.indexOf(hashTagId), 1);
                await place.superupdate(Place, {
                    hashTags: place.hashTags
                });
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async addTop(req, res) {
        let modelId = req.params.id;
        let topId = req.params.idTop;
        try {
            if (modelId && topId) {
                let place = await Place.findById(modelId);
                await place.superupdate(Place, {
                    tops: place.tops.concat(tops)
                });
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeTop(req, res) {
        let modelId = req.params.id;
        let topId = req.params.idTop;
        try {
            if (modelId && topId) {
                let place = await Place.findById(modelId);
                place.tops.splice(place.tops.indexOf(topId), 1);
                await place.superupdate(Place, {
                    tops: place.tops
                });
                res.sendStatus(204);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
};
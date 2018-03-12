let Place = require(global.paths.MODELS + '/Place');
let relationHelper = require(global.paths.HELPERS + '/relationHelper');
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
                let place = await Place.create(req.body);
                res.status(201).json(place);
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
                let updated = await Place.findByIdAndUpdate(placeId, req.body, {runValidators: true,context:'query'});
                if (updated) {
                    res.status(201).json(await Place.findById(placeId));
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
            res.status(400).send(e.toString());
        }
    },
    async addPlaceType(req, res) {
        let modelId = req.params.id;
        let typeId = req.params.idType;
        try {
            if (modelId && typeId) {
                await relationHelper.addRelation
                ('Place', 'PlaceType', modelId, typeId, 'types');
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
                await relationHelper.removeRelation
                ('Place', 'PlaceType', modelId, typeId, 'types');
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
                await relationHelper.addRelation
                ('Place', 'Promo', modelId, promoId, 'promos', 'place');
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
                await relationHelper.removeRelation
                ('Place', 'Promo', modelId, promoId, 'promos', 'place');
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
                await relationHelper.addRelation
                ('Place', 'Complaint', modelId, complaintId, 'complaints', 'place');
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
                await relationHelper.removeRelation
                ('Place', 'Complaint', modelId, complaintId, 'complaints', 'place');
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
                await relationHelper.addRelation
                ('Place', 'DrinkApplication', modelId, appId, 'drinkApplications', 'place');
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
                await relationHelper.removeRelation
                ('Place', 'DrinkApplication', modelId, appId, 'drinkApplications', 'place');
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
                await relationHelper.addRelation
                ('Place', 'Rating', modelId, ratingId, 'ratings', 'place');
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
                await relationHelper.removeRelation
                ('Place', 'Rating', modelId, ratingId, 'ratings', 'place');
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
                await relationHelper.addRelation
                ('Place', 'Department', modelId, departmentId, 'departments', 'place');
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
                await relationHelper.removeRelation
                ('Place', 'Department', modelId, departmentId, 'departments', 'place');
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
                await relationHelper.addRelation
                ('Place', 'PlaceMultilang', modelId, multilangId, 'multilang', 'place');
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
                await relationHelper.removeRelation
                ('Place', 'PlaceMultilang', modelId, multilangId, 'multilang', 'place');
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
                await relationHelper.addRelation
                ('Place', 'Day', modelId, dayId, 'days', 'place');
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
                await relationHelper.removeRelation
                ('Place', 'Day', modelId, dayId, 'days', 'place');
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
                await relationHelper.addRelation
                ('Place', 'HashTag', modelId, hashTagId, 'hashTags', 'place');
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
                await relationHelper.removeRelation
                ('Place', 'HashTag', modelId, hashTagId, 'hashTags', 'place');
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
                await relationHelper.addRelation
                ('Place', 'TopPlace', modelId, topId, 'tops', 'place');
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
                await relationHelper.removeRelation
                ('Place', 'TopPlace', modelId, topId, 'tops', 'place');
                res.sendStatus(204);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
};
let Client = require(global.paths.MODELS + '/Client');
let relationHelper = require(global.paths.HELPERS + '/relationHelper');
let keysValidator = require(global.paths.VALIDATORS + '/keysValidator');
let objectHelper = require(global.paths.HELPERS + '/objectHelper');

module.exports = {
    async getClients(req, res) {
        try {
            let clientsQuery = Client
                .find(req.query.query)
                .sort(req.query.sort)
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    clientsQuery.populate(populateField);
                }
            }
            let clients = await clientsQuery.exec();
            res.json(clients);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async getClientById(req, res) {
        let clientId = req.params.id;
        try {
            let clientQuery = Client.findOne({_id: clientId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    clientQuery.populate(populateField);
                }
            }
            let client = await clientQuery.exec();
            res.json(client);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    //todo
    /*async createClient(req, res) {
        try {
            let client = await Client.create(req.body);
            res.status(201).json(client);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },*/
    async updateClient(req, res) {
        let clientId = req.params.id;
        try {
            let err = keysValidator.diff(Client.schema.tree, req.body);
            if (err) {
                throw new Error('Unknown fields ' + err);
            } else {
                let client = await Client.findById(clientId);
                if (client) {
                    objectHelper.load(client, req.body);
                    let updated = await client.save();
                    res.status(201).json(updated);
                } else {
                    res.sendStatus(404);
                }
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeClient(req, res) {
        let clientId = req.params.id;
        try {
            let removedClient = await Client.findById(clientId);
            if (removedClient) {
                removedClient = await removedClient.remove();
                res.status(204).json(removedClient);
            }else {
                res.sendStatus(404);
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async addOwnPlace(req, res) {
        let modelId = req.params.id;
        let placeId = req.params.idPlace;
        try {
            if (modelId && placeId) {
                await relationHelper.addRelation
                ('Client', 'Place', modelId, placeId, 'ownPlaces', 'boss');
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeOwnPlace(req, res) {
        let modelId = req.params.id;
        let placeId = req.params.idPlace;
        try {
            if (modelId && placeId) {
                await relationHelper.removeRelation
                ('Client', 'Place', modelId, placeId, 'ownPlaces');
                res.sendStatus(204);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async addDrinkApplication(req, res) {
        let modelId = req.params.id;
        let appId = req.params.idApp;
        try {
            if (modelId && appId) {
                await relationHelper.addRelation
                ('Client', 'DrinkApplication', modelId, appId, 'drinkApplications', 'organizer');
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeDrinkApplication(req, res) {
        let modelId = req.params.id;
        let appId = req.params.idApp;
        try {
            if (modelId && appId) {
                await relationHelper.removeRelation
                ('Client', 'DrinkApplication', modelId, appId, 'drinkAppliactions', 'organizer');
                res.sendStatus(204);
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
                ('Client', 'Rating', modelId, ratingId, 'ratings', 'client');
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
                ('Client', 'Rating', modelId, ratingId, 'ratings', 'client');
                res.sendStatus(204);
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
                ('Client', 'Complaint', modelId, complaintId, 'complaints', 'client');
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
                ('Client', 'Complaint', modelId, complaintId, 'complaints', 'client');
                res.sendStatus(204);
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
                ('Client', 'Department', modelId, departmentId, 'departments', 'client');
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
                ('Client', 'Department', modelId, departmentId, 'departments', 'client');
                res.sendStatus(204);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async addFavouritePlace(req, res) {
        let modelId = req.params.id;
        let placeId = req.params.idPlace;
        try {
            if (modelId && placeId) {
                await relationHelper.addRelation
                ('Client', 'Place', modelId, placeId, 'favoritePlaces');
                res.sendStatus(201);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeFavouritePlace(req, res) {
        let modelId = req.params.id;
        let placeId = req.params.idPlace;
        try {
            if (modelId && placeId) {
                await relationHelper.removeRelation
                ('Client', 'Place', modelId, placeId, 'favoritePlaces');
                res.sendStatus(204);
            } else {
                throw new Error('Id in path eq null');
            }
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
};
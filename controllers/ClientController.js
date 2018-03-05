let Client = require('../models/Client');
let relationHelper = require('../helpers/relationHelper');

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
            res.status(404).send(e.toString());
        }
    },
    async getClientById(req, res) {
        let clientId = req.params.id;
        try {
            let clientQuery = Client.find({_id: clientId})
                .select(req.query.fields);
            if (req.query.populate) {
                for (let populateField of req.query.populate) {
                    clientQuery.populate(populateField);
                }
            }
            let client = await clientQuery.exec();
            res.json(client);
        } catch (e) {
            res.status(404).send(e.toString());
        }
    },
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
            let updatedClient = await Client.findByIdAndUpdate(clientId, req.body, {new: true});
            res.status(201).json(updatedClient);
        } catch (e) {
            res.status(400).send(e.toString());
        }
    },
    async removeClient(req, res) {
        let clientId = req.params.id;
        try {
            let removedClient = await Client.findById(clientId);
            removedClient = await removedClient.remove();
            res.status(204).json(removedClient);
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
                ('Client', 'Place', modelId, placeId, 'ownPlaces');
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
                ('Client', 'DrinkApplication', modelId, appId, 'drinkApplications', 'client');
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
                ('Client', 'DrinkApplication', modelId, appId, 'drinkAppliactions', 'client');
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
                ('Client', 'Department', modelId, departmentId, 'departments','client');
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
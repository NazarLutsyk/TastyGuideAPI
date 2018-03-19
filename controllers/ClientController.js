let Client = require(global.paths.MODELS + '/Client');
let keysValidator = require(global.paths.VALIDATORS + '/keysValidator');

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
                    let updated = await client.superupdate(Client,req.body);
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
                let client = await Client.findById(modelId);
                await client.superupdate(Client,{
                    ownPlaces: client.ownPlaces.concat(placeId)
                });
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
                let client = await Client.findById(modelId);
                client.ownPlaces.splice(client.ownPlaces.indexOf(placeId),1);
                await client.superupdate(Client,{
                    ownPlaces: client.ownPlaces
                });
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
                let client = await Client.findById(modelId);
                await client.superupdate(Client,{
                    drinkApplications: client.drinkApplications.concat(appId)
                });
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
                let client = await Client.findById(modelId);
                client.drinkApplications.splice(client.drinkApplications.indexOf(appId),1);
                await client.superupdate(Client,{
                    drinkApplications: client.drinkApplications
                });
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
                let client = await Client.findById(modelId);
                await client.superupdate(Client,{
                    ratings: client.ratings.concat(ratingId)
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
                let client = await Client.findById(modelId);
                client.ratings.splice(client.ratings.indexOf(ratingId),1);
                await client.superupdate(Client,{
                    ratings: client.ratings
                });
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
                let client = await Client.findById(modelId);
                await client.superupdate(Client,{
                    complaints: client.complaints.concat(complaintId)
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
                let client = await Client.findById(modelId);
                client.complaints.splice(client.complaints.indexOf(complaintId),1);
                await client.superupdate(Client,{
                    complaints: client.complaints
                });
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
                let client = await Client.findById(modelId);
                await client.superupdate(Client,{
                    departments: client.departments.concat(departmentId)
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
                let client = await Client.findById(modelId);
                client.departments.splice(client.departments.indexOf(departmentId),1);
                await client.superupdate(Client,{
                    departments: client.departments
                });
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
                let client = await Client.findById(modelId);
                await client.superupdate(Client,{
                    favoritePlaces: client.favoritePlaces.concat(placeId)
                });
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
                let client = await Client.findById(modelId);
                client.favoritePlaces.splice(client.favoritePlaces.indexOf(placeId),1);
                await client.superupdate(Client,{
                    favoritePlaces: client.favoritePlaces
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
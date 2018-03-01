let Client = require('../models/Client');

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
    }
};
let Client = require('../models/Client');

module.exports = {
    async getClients(req, res) {
        try {
            let clients = await Client.find({});
            res.json(clients);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async getClientById(req, res) {
        let clientId = req.params.id;
        try {
            let client = await Client.findById(clientId);
            res.json(client);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async createClient(req, res) {
        try {
            let client = await Client.create(req.body);
            res.json(client);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async updateClient(req, res) {
        let clientId = req.params.id;
        try {
            let updatedClient = await Client.findByIdAndUpdate(clientId, req.body,{new : true});
            res.json(updatedClient);
        } catch (e) {
            res.send(e.toString());
        }
    },
    async removeClient(req, res) {
        let clientId = req.params.id;
        try {
            let removedClient = await Client.findById(clientId);
            removedClient = await removedClient.remove();
            res.json(removedClient);
        } catch (e) {
            res.send(e.toString());
        }
    }
};
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
                    let updated = await client.superupdate(req.body);
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
};
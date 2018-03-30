let Client = require('../models/Client');
let keysValidator = require('../validators/keysValidator');

module.exports = {
    async getClients(req, res,next) {
        try {
            let clientQuery;
            if (req.query.aggregate) {
                clientQuery = Client.aggregate(req.query.aggregate);
            } else {
                clientQuery = Client
                    .find(req.query.query)
                    .sort(req.query.sort)
                    .select(req.query.fields)
                    .skip(req.query.skip)
                    .limit(req.query.limit);
                if (req.query.populate) {
                    for (let populateField of req.query.populate) {
                        clientQuery.populate(populateField);
                    }
                }
            }
            let clients = await clientQuery.exec();
            res.json(clients);
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async getClientById(req, res,next) {
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
            e.status = 400;
            return next(e);
        }
    },
    async updateClient(req, res,next) {
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
                    let e = new Error();
                    e.message = 'Not found';
                    e.status = 404;
                    return next(e);
                }
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
    async removeClient(req, res,next) {
        let clientId = req.params.id;
        try {
            let removedClient = await Client.findById(clientId);
            if (removedClient) {
                removedClient = await removedClient.remove();
                res.status(204).json(removedClient);
            } else {
                let e = new Error();
                e.message = 'Not found';
                e.status = 404;
                return next(e);
            }
        } catch (e) {
            e.status = 400;
            return next(e);
        }
    },
};
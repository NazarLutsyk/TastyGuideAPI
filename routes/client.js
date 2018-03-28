const ClientController = require(global.paths.CONTROLLERS + '/ClientController');
const express = require('express');

let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rule = require(global.paths.MIDDLEWARE + '/authorizarion/rules/Client');

const router = express.Router();

router.route('/')
    .get(ClientController.getClients);
router.route('/:id')
    .get(ClientController.getClientById)
    .put(permission(Rule.updateClient),permission(Rule.updatable),ClientController.updateClient)
    .delete(permission(Rule.updateClient),ClientController.removeClient);
module.exports = router;

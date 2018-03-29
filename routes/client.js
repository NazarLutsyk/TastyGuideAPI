const ClientController = require(global.paths.CONTROLLERS + '/ClientController');
let ROLES = require(global.paths.CONFIG + '/roles');
const express = require('express');

let Client = require(global.paths.MODELS + '/Client');
let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let ClientRule = require(global.paths.MIDDLEWARE + '/authorizarion/rules/Client');
let GlobalRule = require(global.paths.MIDDLEWARE + '/authorizarion/rules/Global');

const router = express.Router();

router.route('/')
    .get(ClientController.getClients);
router.route('/:id')
    .get(ClientController.getClientById)
    .put(
        permission.rule(GlobalRule.updatable(Client.notUpdatable),ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        permission.rule(ClientRule.updateClient,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        ClientController.updateClient
    )
    .delete(
        permission.rule(ClientRule.updateClient,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        ClientController.removeClient
    );
module.exports = router;

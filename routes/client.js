const ClientController = require('../controllers/ClientController');
let ROLES = require('../config/roles');
const express = require('express');

let Client = require('../models/Client');
let permission = require('../middleware/authorizarion/index');
let ClientRule = require('../middleware/authorizarion/rules/Client');
let GlobalRule = require('../middleware/authorizarion/rules/Global');

const router = express.Router();

router.route('/')
    .get(ClientController.getClients);
router.route('/:id')
    .get(ClientController.getClientById)
    .put(
        permission.rule(GlobalRule.updatable(Client.notUpdatable()),ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        permission.rule(ClientRule.updateClient,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        ClientController.updateClient
    )
    .delete(
        permission.rule(ClientRule.updateClient,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        ClientController.removeClient
    );
module.exports = router;

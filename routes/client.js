const ClientController = require('../controllers/ClientController');
const express = require('express');

let permission = require('../middleware/authorizarion/index');
let Rule = require('../middleware/authorizarion/rules/Client');

const router = express.Router();

router.route('/')
    .get(ClientController.getClients);
    // .post(ClientController.createClient);
router.route('/:id')
    .get(ClientController.getClientById)
    .put(permission(Rule.updateClient),ClientController.updateClient)
    .delete(permission(Rule.updateClient),ClientController.removeClient);
module.exports = router;

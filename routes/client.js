const ClientController = require('../controllers/ClientController');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(ClientController.getClients);
    // .post(ClientController.createClient);
router.route('/:id')
    .get(ClientController.getClientById)
    .put(ClientController.updateClient)
    .delete(ClientController.removeClient);
module.exports = router;

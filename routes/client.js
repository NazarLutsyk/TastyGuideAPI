const ClientController = require(global.paths.CONTROLLERS + '/ClientController');
const express = require('express');

let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rule = require(global.paths.MIDDLEWARE + '/authorizarion/rules/Client');

const router = express.Router();

router.route('/')
    .get(ClientController.getClients);
    // .post(ClientController.createClient);
router.route('/:id')
    .get(ClientController.getClientById)
    .put(permission(Rule.updateClient),ClientController.updateClient)
    .delete(permission(Rule.updateClient),ClientController.removeClient);
router.route('/:id/ownPlaces/:idPlace')
    .put(permission(),ClientController.addOwnPlace)
    .delete(permission(),ClientController.removeOwnPlace);
router.route('/:id/drinkApplications/:idApp')
    .put(permission(),ClientController.addDrinkApplication)
    .delete(permission(),ClientController.removeDrinkApplication);
router.route('/:id/ratings/:idRating')
    .put(permission(),ClientController.addRating)
    .delete(permission(),ClientController.removeRating);
router.route('/:id/complaints/:idComplaint')
    .put(permission(),ClientController.addComplaint)
    .delete(permission(),ClientController.removeComplaint);
router.route('/:id/departments/:idDepartment')
    .put(permission(),ClientController.addDepartment)
    .delete(permission(),ClientController.removeDepartment);
router.route('/:id/favoritePlaces/:idPlace')
    .put(permission(),ClientController.addFavouritePlace)
    .delete(permission(),ClientController.removeFavouritePlace);

//todo
module.exports = router;

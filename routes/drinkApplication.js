const DrinkApplicationController = require(global.paths.CONTROLLERS + '/DrinkApplicationController');
const express = require('express');

let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rule = require(global.paths.MIDDLEWARE + '/authorizarion/rules/DrinkApplication');

const router = express.Router();

router.route('/')
    .get(DrinkApplicationController.getDrinkApplications)
    .post(DrinkApplicationController.createDrinkApplication);
router.route('/:id')
    .get(DrinkApplicationController.getDrinkApplicationById)
    .put(permission(Rule.updateDrinkApplication),DrinkApplicationController.updateDrinkApplication)
    .delete(permission(Rule.updateDrinkApplication),DrinkApplicationController.removeDrinkApplication);

module.exports = router;

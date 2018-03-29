const DrinkApplicationController = require(global.paths.CONTROLLERS + '/DrinkApplicationController');
let ROLES = require(global.paths.CONFIG + '/roles');
const express = require('express');

let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rule = require(global.paths.MIDDLEWARE + '/authorizarion/rules/DrinkApplication');

const router = express.Router();

router.route('/')
    .get(DrinkApplicationController.getDrinkApplications)
    .post(DrinkApplicationController.createDrinkApplication);
router.route('/:id')
    .get(DrinkApplicationController.getDrinkApplicationById)
    .put(
        permission.rule(Rule.updateDrinkApplication,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        DrinkApplicationController.updateDrinkApplication
    )
    .delete(
        permission.rule(Rule.updateDrinkApplication,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        DrinkApplicationController.removeDrinkApplication
    );

module.exports = router;

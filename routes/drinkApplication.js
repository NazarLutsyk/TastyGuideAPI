const DrinkApplicationController = require('../controllers/DrinkApplicationController');
let ROLES = require('../config/roles');
const express = require('express');

let permission = require('../middleware/authorizarion/index');
let Rule = require('../middleware/authorizarion/rules/DrinkApplication');

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

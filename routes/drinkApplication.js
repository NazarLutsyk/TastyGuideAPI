const DrinkApplicationController = require('../controllers/DrinkApplicationController');
const express = require('express');

let permission = require('../middleware/authorizarion/index');
let Rule = require('../middleware/authorizarion/rules/DrinkApplication');

const router = express.Router();

router.route('/')
    .get(DrinkApplicationController.getDrinkApplications)
    .post(DrinkApplicationController.createDrinkApplication);
router.route('/:id')
    .get(DrinkApplicationController.getDrinkApplicationById)
    .put(permission(Rule.updateDrinkApplication),DrinkApplicationController.updateDrinkApplication)
    .delete(permission(Rule.updateDrinkApplication),DrinkApplicationController.removeDrinkApplication);

module.exports = router;

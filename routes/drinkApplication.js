const DrinkApplicationController = require('../controllers/DrinkApplicationController');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(DrinkApplicationController.getDrinkApplications)
    .post(DrinkApplicationController.createDrinkApplication);
router.route('/:id')
    .get(DrinkApplicationController.getDrinkApplicationById)
    .put(DrinkApplicationController.updateDrinkApplication)
    .delete(DrinkApplicationController.removeDrinkApplication);

module.exports = router;

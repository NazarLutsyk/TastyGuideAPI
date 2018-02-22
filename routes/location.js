const LocationController = require('../controllers/LocationController');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(LocationController.getLocations)
    .post(LocationController.createLocation);
router.route('/:id')
    .get(LocationController.getLocationById)
    .put(LocationController.updateLocation)
    .delete(LocationController.removeLocation);

module.exports = router;

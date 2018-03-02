const LocationController = require('../controllers/LocationController');
const express = require('express');

let permission = require('../middleware/authorizarion/index');
let Rule = require('../middleware/authorizarion/rules/Location');

const router = express.Router();

router.route('/')
    .get(LocationController.getLocations)
    .post(permission(Rule.updateLocation),LocationController.createLocation);
router.route('/:id')
    .get(LocationController.getLocationById)
    .put(permission(Rule.updateLocation),LocationController.updateLocation)
    .delete(permission(Rule.updateLocation),LocationController.removeLocation);

module.exports = router;

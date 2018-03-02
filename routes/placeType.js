const PlaceTypeController = require('../controllers/PlaceTypeController');
const express = require('express');
let permission = require('../middleware/authorizarion/index');

const router = express.Router();

router.route('/')
    .get(PlaceTypeController.getPlaceTypes)
    .post(permission(),PlaceTypeController.createPlaceType);
router.route('/:id')
    .get(PlaceTypeController.getPlaceTypeById)
    .put(permission(),PlaceTypeController.updatePlaceType)
    .delete(permission(),PlaceTypeController.removePlaceType);

module.exports = router;

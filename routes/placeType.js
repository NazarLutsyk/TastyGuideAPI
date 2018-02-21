const PlaceTypeController = require('../controllers/PlaceTypeController');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(PlaceTypeController.getPlaceTypes)
    .post(PlaceTypeController.createPlaceType);
router.route('/:id')
    .get(PlaceTypeController.getPlaceTypeById)
    .put(PlaceTypeController.updatePlaceType)
    .delete(PlaceTypeController.removePlaceType);

module.exports = router;

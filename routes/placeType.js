const PlaceTypeController = require(global.paths.CONTROLLERS + '/PlaceTypeController');
const express = require('express');
let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');

const router = express.Router();

router.route('/')
    .get(PlaceTypeController.getPlaceTypes)
    .post(permission(),PlaceTypeController.createPlaceType);
router.route('/:id')
    .get(PlaceTypeController.getPlaceTypeById)
    .put(permission(),PlaceTypeController.updatePlaceType)
    .delete(permission(),PlaceTypeController.removePlaceType);
module.exports = router;

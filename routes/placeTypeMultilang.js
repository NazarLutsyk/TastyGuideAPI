const PlaceTypeMultilangController = require(global.paths.CONTROLLERS+ '/PlaceTypeMultilangController');
const express = require('express');
let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');

const router = express.Router();

router.route('/')
    .get(PlaceTypeMultilangController.getPlaceTypeMultilangs)
    .post(permission(),PlaceTypeMultilangController.createPlaceTypeMultilang);
router.route('/:id')
    .get(PlaceTypeMultilangController.getPlaceTypeMultilangById)
    .put(permission(),PlaceTypeMultilangController.updatePlaceTypeMultilang)
    .delete(permission(),PlaceTypeMultilangController.removePlaceTypeMultilang);

module.exports = router;

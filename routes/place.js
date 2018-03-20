const PlaceController = require(global.paths.CONTROLLERS + '/PlaceController');
let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rules = require(global.paths.MIDDLEWARE + '/authorizarion/rules/Place');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(PlaceController.getPlaces)
    .post(PlaceController.createPlace);
router.route('/:id')
    .get(PlaceController.getPlaceById)
    .put(permission(Rules.updatePlace),PlaceController.updatePlace)
    .delete(permission(Rules.updatePlace),PlaceController.removePlace);
module.exports = router;
//todo

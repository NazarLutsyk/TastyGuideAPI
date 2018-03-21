const PlaceMultilangController = require(global.paths.CONTROLLERS + '/PlaceMultilangController');
const express = require('express');

let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rule = require(global.paths.MIDDLEWARE + '/authorizarion/rules/PlaceMultilang');

const router = express.Router();

router.route('/')
    .get(PlaceMultilangController.getPlaceMultilangs)
    .post(permission(Rule.createPlaceMultilang),PlaceMultilangController.createPlaceMultilang);
router.route('/:id')
    .get(PlaceMultilangController.getPlaceMultilangById)
    .put(permission(Rule.updatePlaceMultilang),PlaceMultilangController.updatePlaceMultilang)
    .delete(permission(Rule.updatePlaceMultilang),PlaceMultilangController.removePlaceMultilang);

module.exports = router;

const PlaceMultilangController = require('../controllers/PlaceMultilangController');
const express = require('express');

let permission = require('../middleware/authorizarion/index');
let Rule = require('../middleware/authorizarion/rules/PlaceMultilang');

const router = express.Router();

router.route('/')
    .get(PlaceMultilangController.getPlaceMultilangs)
    .post(permission(Rule.updatePlaceMultilang),PlaceMultilangController.createPlaceMultilang);
router.route('/:id')
    .get(PlaceMultilangController.getPlaceMultilangById)
    .put(permission(Rule.updatePlaceMultilang),PlaceMultilangController.updatePlaceMultilang)
    .delete(permission(Rule.updatePlaceMultilang),PlaceMultilangController.removePlaceMultilang);

module.exports = router;

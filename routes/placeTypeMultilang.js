const PlaceTypeMultilangController = require('../controllers/PlaceTypeMultilangController');
const express = require('express');
let permission = require('../middleware/authorizarion/index');

const router = express.Router();

router.route('/')
    .get(PlaceTypeMultilangController.getPlaceTypeMultilangs)
    .post(permission(),PlaceTypeMultilangController.createPlaceTypeMultilang);
router.route('/:id')
    .get(PlaceTypeMultilangController.getPlaceTypeMultilangById)
    .put(permission(),PlaceTypeMultilangController.updatePlaceTypeMultilang)
    .delete(permission(),PlaceTypeMultilangController.removePlaceTypeMultilang);

module.exports = router;

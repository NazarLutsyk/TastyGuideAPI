const PlaceTypeMultilangController = require('../controllers/PlaceTypeMultilangController');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(PlaceTypeMultilangController.getPlaceTypeMultilangs)
    .post(PlaceTypeMultilangController.createPlaceTypeMultilang);
router.route('/:id')
    .get(PlaceTypeMultilangController.getPlaceTypeMultilangById)
    .put(PlaceTypeMultilangController.updatePlaceTypeMultilang)
    .delete(PlaceTypeMultilangController.removePlaceTypeMultilang);

module.exports = router;

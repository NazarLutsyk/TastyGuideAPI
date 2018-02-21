const PlaceMultilangController = require('../controllers/PlaceMultilangController');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(PlaceMultilangController.getPlaceMultilangs)
    .post(PlaceMultilangController.createPlaceMultilang);
router.route('/:id')
    .get(PlaceMultilangController.getPlaceMultilangById)
    .put(PlaceMultilangController.updatePlaceMultilang)
    .delete(PlaceMultilangController.removePlaceMultilang);

module.exports = router;

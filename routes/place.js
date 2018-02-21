const PlaceController = require('../controllers/PlaceController');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(PlaceController.getPlaces)
    .post(PlaceController.createPlace);
router.route('/:id')
    .get(PlaceController.getPlaceById)
    .put(PlaceController.updatePlace)
    .delete(PlaceController.removePlace);

module.exports = router;

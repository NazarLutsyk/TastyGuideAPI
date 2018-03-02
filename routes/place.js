const PlaceController = require('../controllers/PlaceController');
let permission = require('../middleware/authorizarion/index');
let Rules = require('../middleware/authorizarion/rules/Place');
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

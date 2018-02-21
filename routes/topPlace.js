const TopPlaceController = require('../controllers/TopPlaceController');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(TopPlaceController.getTopPlaces)
    .post(TopPlaceController.createTopPlace);
router.route('/:id')
    .get(TopPlaceController.getTopPlaceById)
    .put(TopPlaceController.updateTopPlace)
    .delete(TopPlaceController.removeTopPlace);

module.exports = router;

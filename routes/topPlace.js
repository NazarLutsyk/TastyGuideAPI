const TopPlaceController = require('../controllers/TopPlaceController');
const express = require('express');
let permission = require('../middleware/authorizarion/index');

const router = express.Router();

router.route('/')
    .get(TopPlaceController.getTopPlaces)
    .post(permission(),TopPlaceController.createTopPlace);
router.route('/:id')
    .get(TopPlaceController.getTopPlaceById)
    .put(permission(),TopPlaceController.updateTopPlace)
    .delete(permission(),TopPlaceController.removeTopPlace);

module.exports = router;

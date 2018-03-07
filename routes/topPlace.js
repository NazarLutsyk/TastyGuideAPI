const TopPlaceController = require(global.paths.CONTROLLERS + '/TopPlaceController');
const express = require('express');
let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');

const router = express.Router();

router.route('/')
    .get(TopPlaceController.getTopPlaces)
    .post(permission(),TopPlaceController.createTopPlace);
router.route('/:id')
    .get(TopPlaceController.getTopPlaceById)
    .put(permission(),TopPlaceController.updateTopPlace)
    .delete(permission(),TopPlaceController.removeTopPlace);

module.exports = router;

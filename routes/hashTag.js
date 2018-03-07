const HashTagController = require(global.paths.CONTROLLERS + '/HashTagController');
const express = require('express');

let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');

const router = express.Router();

router.route('/')
    .get(HashTagController.getHashTags)
    .post(permission(),HashTagController.createHashTag);
router.route('/:id')
    .get(HashTagController.getHashTagById)
    .put(permission(),HashTagController.updateHashTag)
    .delete(permission(),HashTagController.removeHashTag);
router.route('/:id/places/:idPlace')
    .put(permission(),HashTagController.addPlace)
    .delete(permission(),HashTagController.removePlace);

module.exports = router;

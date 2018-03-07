const RatingController = require(global.paths.CONTROLLERS + '/RatingController');
const express = require('express');

let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rule = require(global.paths.MIDDLEWARE + '/authorizarion/rules/Rating');

const router = express.Router();

router.route('/')
    .get(RatingController.getRatings)
    .post(RatingController.createRating);
router.route('/:id')
    .get(RatingController.getRatingById)
    .put(permission(Rule.updateRating),RatingController.updateRating)
    .delete(permission(Rule.updateRating),RatingController.removeRating);

module.exports = router;

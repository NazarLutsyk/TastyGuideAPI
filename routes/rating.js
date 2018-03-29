const RatingController = require(global.paths.CONTROLLERS + '/RatingController');
const express = require('express');
let ROLES = require(global.paths.CONFIG + '/roles');

let permission = require(global.paths.MIDDLEWARE + '/authorizarion/index');
let Rule = require(global.paths.MIDDLEWARE + '/authorizarion/rules/Rating');

const router = express.Router();

router.route('/')
    .get(RatingController.getRatings)
    .post(RatingController.createRating);
router.route('/:id')
    .get(RatingController.getRatingById)
    .put(
        permission.rule(Rule.updateRating,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        RatingController.updateRating
    )
    .delete(
        permission.rule(Rule.updateRating,ROLES.GLOBAL_ROLES.ADMIN_ROLE),
        RatingController.removeRating
    );

module.exports = router;

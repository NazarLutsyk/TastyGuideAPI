const RatingController = require('../controllers/RatingController');
const express = require('express');
let ROLES = require('../config/roles');

let permission = require('../middleware/authorizarion/index');
let Rule = require('../middleware/authorizarion/rules/Rating');

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

const RatingController = require('../controllers/RatingController');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(RatingController.getRatings)
    .post(RatingController.createRating);
router.route('/:id')
    .get(RatingController.getRatingById)
    .put(RatingController.updateRating)
    .delete(RatingController.removeRating);

module.exports = router;

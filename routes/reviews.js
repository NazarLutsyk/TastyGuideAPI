const ReviewController = require('../controllers/ReviewController');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(ReviewController.getReviews);
module.exports = router;

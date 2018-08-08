const PromoController = require('../controllers/PromoController');
const express = require('express');

const router = express.Router();

router.route('/')
    .get(PromoController.getPromos);

router.route('/:id')
    .get(PromoController.getPromoById);

module.exports = router;
